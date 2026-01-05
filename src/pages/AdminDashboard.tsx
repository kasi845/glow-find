import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import {
    apiGetAdminUsers,
    apiDeleteUser,
    apiBlockUser,
    apiUnblockUser,
    apiGetAdminReports,
    apiDeleteAdminItem,
    apiGetAdminFlags
} from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Trash, Shield, Ban, CheckCircle, MapPin, Calendar, AlertTriangle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const AdminDashboard = () => {
    const { user, token } = useApp();
    const navigate = useNavigate();
    const [users, setUsers] = useState<any[]>([]);
    const [items, setItems] = useState<any[]>([]);
    const [flags, setFlags] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token && user) {
            if (!user.isAdmin) {
                navigate('/');
            } else {
                loadData();
            }
        }
    }, [user, token, navigate]);

    const loadData = async () => {
        if (!token) return;
        try {
            const [usersData, itemsData, flagsData] = await Promise.all([
                apiGetAdminUsers(token),
                apiGetAdminReports(token),
                apiGetAdminFlags(token)
            ]);
            setUsers(usersData);
            setItems(itemsData);
            setFlags(flagsData);
        } catch (e) {
            console.error(e);
            toast({ title: "Failed to load data", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleBlockToggle = async (u: any) => {
        if (!token) return;
        try {
            if (u.isBlocked) {
                await apiUnblockUser(token, u.id);
                toast({ title: "User unblocked" });
            } else {
                await apiBlockUser(token, u.id);
                toast({ title: "User blocked" });
            }
            // Update local state
            setUsers(users.map(user => user.id === u.id ? { ...user, isBlocked: !user.isBlocked } : user));
        } catch (e) {
            toast({ title: "Action failed", variant: "destructive" });
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm("Are you sure? This will delete the user AND their items.")) return;
        if (!token) return;
        try {
            await apiDeleteUser(token, userId);
            setUsers(users.filter(u => u.id !== userId));
            // Optimistic update for items
            const deletedUser = users.find(u => u.id === userId);
            if (deletedUser) {
                setItems(items.filter(i => i.reporterName !== deletedUser.name));
            }
            toast({ title: "User deleted" });
        } catch (e) {
            toast({ title: "Failed to delete", variant: "destructive" });
        }
    };

    const handleDeleteItem = async (itemId: string) => {
        // "Side not on top": Using a toast notification with an action button is the standard
        // way to present non-blocking, side-positioned confirmation in this UI library.
        toast({
            title: "Delete this item?",
            description: "The reporter will be notified.",
            action: (
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => performDelete(itemId)}
                >
                    Delete
                </Button>
            ),
            duration: 5000,
        });
    };

    const performDelete = async (itemId: string) => {
        if (!token) return;
        try {
            await apiDeleteAdminItem(token, itemId);
            setItems(prev => prev.filter(i => i.id !== itemId));
            toast({ title: "Item deleted", description: "User has been notified." });
        } catch (e: any) {
            console.error("Delete failed:", e);
            toast({
                title: "Failed to delete item",
                description: e.message || "Unknown error",
                variant: "destructive"
            });
        }
    };

    if (loading) return <div className="p-10 pt-24 text-center text-white">Loading Admin Portal...</div>;

    const lostItems = items.filter(i => i.type === 'lost' || (i.status === 'lost' && !i.type));
    const foundItems = items.filter(i => i.type === 'found' || (i.status === 'found' && !i.type));

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <div className="container mx-auto pt-24 px-4 pb-12">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Shield className="text-red-500" /> Admin Portal
                    </h1>
                </div>

                <Tabs defaultValue="users" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-8 bg-muted/20">
                        <TabsTrigger value="users">Manage Users</TabsTrigger>
                        <TabsTrigger value="lost">Lost ({lostItems.length})</TabsTrigger>
                        <TabsTrigger value="found">Found ({foundItems.length})</TabsTrigger>
                        <TabsTrigger value="flags">Flags ({flags.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="users">
                        <div className="glass-card p-6 border border-white/10 rounded-xl">
                            <h2 className="text-xl font-semibold mb-4">Registered Users ({users.length})</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="text-muted-foreground border-b border-white/10">
                                        <tr>
                                            <th className="p-3">Name</th>
                                            <th className="p-3">Email</th>
                                            <th className="p-3">Joined</th>
                                            <th className="p-3">Status</th>
                                            <th className="p-3">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(u => (
                                            <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="p-3 font-medium">{u.name}</td>
                                                <td className="p-3 text-sm text-muted-foreground">{u.email}</td>
                                                <td className="p-3 text-sm">{new Date(u.createdAt).toLocaleDateString()}</td>
                                                <td className="p-3">
                                                    {u.isAdmin ? (
                                                        <Badge variant="default" className="bg-purple-500/20 text-purple-200 hover:bg-purple-500/30">Admin</Badge>
                                                    ) : u.isBlocked ? (
                                                        <Badge variant="destructive">Blocked</Badge>
                                                    ) : (
                                                        <Badge variant="secondary" className="bg-green-500/10 text-green-400">Active</Badge>
                                                    )}
                                                </td>
                                                <td className="p-3 flex gap-2">
                                                    {!u.isAdmin && (
                                                        <>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleBlockToggle(u)}
                                                                className={u.isBlocked ? "text-green-500 hover:text-green-400 hover:bg-green-500/10" : "text-amber-500 hover:text-amber-400 hover:bg-amber-500/10"}
                                                                title={u.isBlocked ? "Unblock User" : "Block User"}
                                                            >
                                                                {u.isBlocked ? <CheckCircle size={18} /> : <Ban size={18} />}
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDeleteUser(u.id)}
                                                                className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                                                title="Delete User"
                                                            >
                                                                <Trash size={18} />
                                                            </Button>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="lost">
                        <ItemTable items={lostItems} onDelete={handleDeleteItem} />
                    </TabsContent>

                    <TabsContent value="found">
                        <ItemTable items={foundItems} onDelete={handleDeleteItem} />
                    </TabsContent>

                    <TabsContent value="flags">
                        <div className="glass-card p-6 border border-white/10 rounded-xl">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <AlertTriangle className="text-red-500" /> User Flags / Reports
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="text-muted-foreground border-b border-white/10">
                                        <tr>
                                            <th className="p-3">Item Title</th>
                                            <th className="p-3">Reason</th>
                                            <th className="p-3">Description</th>
                                            <th className="p-3">Reporter</th>
                                            <th className="p-3">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {flags.map(f => (
                                            <tr key={f.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="p-3 font-medium text-white">{f.itemTitle}</td>
                                                <td className="p-3"><Badge variant="destructive">{f.reason}</Badge></td>
                                                <td className="p-3 text-sm text-muted-foreground max-w-xs truncate" title={f.description}>{f.description}</td>
                                                <td className="p-3 text-sm text-white">{f.reporterEmail}</td>
                                                <td className="p-3 text-sm text-muted-foreground">{new Date(f.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                        {flags.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No flags found.</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

// Helper Component for Reports Table
const ItemTable = ({ items, onDelete }: { items: any[], onDelete: (id: string) => void }) => (
    <div className="glass-card p-6 border border-white/10 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Report Details</h2>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="text-muted-foreground border-b border-white/10">
                    <tr>
                        <th className="p-3">Item Info</th>
                        <th className="p-3">Reporter Details</th>
                        <th className="p-3">Location & Date</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => (
                        <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="p-3 max-w-[200px]">
                                <div className="font-medium text-white">{item.itemtitle}</div>
                                <div className="text-xs text-muted-foreground truncate" title={item.description}>{item.description}</div>
                            </td>
                            <td className="p-3">
                                <div className="flex flex-col text-sm">
                                    <span className="text-white">{item.reporterName}</span>
                                    <span className="text-muted-foreground text-xs">{item.reporterEmail}</span>
                                </div>
                            </td>
                            <td className="p-3">
                                <div className="flex flex-col text-sm gap-1">
                                    <span className="flex items-center gap-1 text-muted-foreground"><MapPin size={12} /> {item.location}</span>
                                    <span className="flex items-center gap-1 text-muted-foreground"><Calendar size={12} /> {new Date(item.createdAt).toLocaleDateString()}</span>
                                </div>
                            </td>
                            <td className="p-3">
                                <Badge variant="outline" className="capitalize border-white/20">{item.status}</Badge>
                            </td>
                            <td className="p-3">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onDelete(item.id)}
                                    className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                    title="Delete Item & Notify User"
                                >
                                    <Trash size={18} />
                                </Button>
                            </td>
                        </tr>
                    ))}
                    {items.length === 0 && (
                        <tr>
                            <td colSpan={5} className="p-8 text-center text-muted-foreground">No reports found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
);

export default AdminDashboard;
