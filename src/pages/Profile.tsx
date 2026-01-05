import { useState, useEffect, useRef } from 'react';
import { User, Mail, Edit, LogOut, Package, Search, Check, Clock, Camera, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { FloatingIcons } from '@/components/FloatingIcons';
import { PageTransition } from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApp, Item } from '@/contexts/AppContext';
import { toast } from '@/hooks/use-toast';
import { apiGetUserStats, apiUpdateUser, apiUploadImage, apiGetItems, apiDeleteItem } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UserStats {
  items_reported_total: number;
  items_reported_active: number;
  items_found_total: number;
  items_found_active: number;
  claims_accepted: number;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser, token } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200'
  });
  const [statsData, setStatsData] = useState<UserStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [myItems, setMyItems] = useState<Item[]>([]);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const fetchMyItems = async () => {
    if (!token || !user) return;
    try {
      const allItems = await apiGetItems(undefined, undefined, true);
      // Backend returns raw objects. key: reportedby
      const mineRaw = allItems.filter((i: any) => i.reportedby === user.name);

      const mine = mineRaw.map((i: any) => ({
        id: i.id,
        title: i.itemtitle,
        description: i.description,
        category: i.category,
        location: i.location,
        date: i.date,
        contact: i.contact,
        image: i.imageurl,
        type: i.type,
        status: i.status,
        userId: i.reportedby,
        userName: i.reportedby
      }));
      setMyItems(mine);
    } catch (error) {
      console.error("Failed to fetch my items", error);
    }
  };

  const handleDeleteItem = (itemId: string) => {
    setItemToDelete(itemId);
  };

  const confirmDelete = async () => {
    if (!token || !itemToDelete) return;

    try {
      await apiDeleteItem(token, itemToDelete);
      setMyItems(prev => prev.filter(i => i.id !== itemToDelete));
      toast({
        title: "Item Deleted",
        description: "The item has been removed."
      });
      fetchStats();
    } catch (error: any) {
      toast({
        title: "Deletion Failed",
        description: error.message || "Could not delete item.",
        variant: "destructive"
      });
    } finally {
      setItemToDelete(null);
    }
  };

  const fetchStats = async () => {
    if (token) {
      setLoadingStats(true);
      try {
        console.log("Fetching stats...");
        const data = await apiGetUserStats(token);
        console.log("Stats received:", data);
        setStatsData(data);
      } catch (error) {
        console.error("Failed to fetch user stats", error);
        toast({
          title: "Error fetching stats",
          description: "Could not load profile statistics.",
          variant: "destructive"
        });
      } finally {
        setLoadingStats(false);
      }
    }
  };

  useEffect(() => {
    fetchStats();
    fetchMyItems();
  }, [token, user?.name]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Show loading state or toast
        const loadingToast = toast({ title: "Uploading image...", duration: 2000 });
        const res = await apiUploadImage(file);
        setEditData(prev => ({ ...prev, avatar: res.url }));
        toast({ title: "Image uploaded! 📸", description: "Don't forget to save changes." });
      } catch (error) {
        console.error("Upload failed", error);
        toast({
          title: "Upload Failed",
          description: "Could not upload image.",
          variant: "destructive"
        });
      }
    }
  };

  const handleSave = async () => {
    if (!token) return;
    try {
      await apiUpdateUser(token, { name: editData.name, avatar: editData.avatar });
      updateUser({ name: editData.name, avatar: editData.avatar });
      setIsEditing(false);
      toast({
        title: "Profile Updated! ✨",
        description: "Your changes have been saved.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Could not save profile changes.",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const stats = [
    {
      label: 'Items Reported',
      icon: Search,
      value: statsData?.items_reported_total || 0,
      subLabel: `${statsData?.items_reported_active || 0} active`,
      color: 'from-orange-500 to-red-500'
    },
    {
      label: 'Items Found',
      icon: Package,
      value: statsData?.items_found_total || 0,
      subLabel: `${statsData?.items_found_active || 0} active`,
      color: 'from-green-500 to-emerald-500'
    },
    {
      label: 'Claims Accepted',
      icon: Check,
      value: statsData?.claims_accepted || 0,
      subLabel: 'Total accepted',
      color: 'from-purple-500 to-violet-500'
    },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background relative">
        {/* Slightly lighter gradient for variety */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-card/50 to-background pointer-events-none" />

        <FloatingIcons />
        <Navbar />

        <main className="relative z-10 pt-24 pb-12 px-6">
          <div className="container mx-auto max-w-2xl">
            <div
              className="mb-8 text-center"
            >
              <div className="flex items-center justify-center gap-4 mb-4">
                <h1 className="font-display text-4xl md:text-5xl font-bold">
                  <span className="gradient-text">Your Profile</span>
                </h1>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={fetchStats}
                  disabled={loadingStats}
                  className={loadingStats ? "animate-spin" : ""}
                >
                  <Clock size={24} className="text-muted-foreground" />
                </Button>
              </div>
            </div>

            {/* Profile Card */}
            <div
              className="glass-card p-8 mb-8"
            >
              <div className="flex flex-col items-center mb-8">
                {/* Editable Avatar */}
                <div
                  className={`relative mb-6 group cursor-pointer transition-transform ${isEditing ? 'hover:scale-105' : ''}`}
                  onClick={() => isEditing && fileInputRef.current?.click()}
                >
                  <img
                    src={isEditing ? (editData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200') : (user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200')}
                    alt={user?.name}
                    className={`w-32 h-32 rounded-full object-cover border-4 border-primary/30 transition-all ${isEditing ? 'group-hover:border-primary/60' : ''}`}
                  />
                  {/* Camera overlay - only visible when editing */}
                  {isEditing && (
                    <div
                      className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Camera size={32} className="text-white" />
                    </div>
                  )}
                  <div
                    className="absolute bottom-0 right-0 w-10 h-10 rounded-full gradient-bg flex items-center justify-center border-4 border-card"
                  >
                    <User size={18} className="text-primary-foreground" />
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleImageChange}
                  />
                </div>

                <div>
                  {isEditing ? (
                    <div
                      className="w-full space-y-4"
                      key="editing"
                    >
                      <div>
                        <label className="block text-sm font-medium mb-2">Name</label>
                        <Input
                          value={editData.name}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-muted-foreground mb-2">Email</label>
                        <div className="px-4 py-3 rounded-xl bg-muted/30 text-muted-foreground cursor-not-allowed border border-border/50">
                          {user?.email}
                        </div>
                        <span className="text-xs text-muted-foreground mt-1 block">
                          Email cannot be changed for security reasons
                        </span>
                      </div>
                      <div className="flex gap-3 justify-center">
                        <div className="hover:scale-105 transition-transform">
                          <Button onClick={handleSave} variant="gradient">
                            Save Changes
                          </Button>
                        </div>
                        <div className="hover:scale-105 transition-transform">
                          <Button onClick={() => setIsEditing(false)} variant="outline">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      key="display"
                      className="text-center"
                    >
                      <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                        {user?.name}
                      </h2>
                      <p className="text-muted-foreground flex items-center justify-center gap-2">
                        <Mail size={16} />
                        {user?.email}
                      </p>
                      <div className="hover:scale-105 transition-transform">
                        <Button
                          onClick={() => setIsEditing(true)}
                          variant="glass"
                          className="mt-4"
                        >
                          <Edit size={16} className="mr-2" />
                          Edit Profile
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats - 3 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="glass-card p-6 cursor-pointer overflow-hidden relative hover:scale-105 transition-transform"
                >
                  {/* Glow effect */}
                  <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full bg-gradient-to-br ${stat.color} opacity-20 blur-2xl`} />

                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg transition-transform hover:rotate-12`}
                  >
                    <stat.icon className="text-primary-foreground" size={24} />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-1">
                    {stat.label}
                  </h3>
                  <p className="text-3xl font-bold gradient-text mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.subLabel}</p>
                </div>
              ))}
            </div>

            {/* My Reports */}
            {myItems.length > 0 && (
              <div className="mb-8">
                <h2 className="font-display text-2xl font-bold mb-4 gradient-text">My Reports</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {myItems.map(item => (
                    <div key={item.id} className="glass-card p-4 relative group hover:scale-[1.02] transition-transform duration-300">
                      <div className="aspect-w-4 aspect-h-3 mb-4 rounded-lg overflow-hidden bg-muted">
                        <img
                          src={item.image || "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400"}
                          alt={item.title}
                          className="w-full h-40 object-cover"
                        />
                      </div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-foreground truncate flex-1 pr-2">{item.title}</h3>
                        <Badge variant={item.type === 'lost' ? 'destructive' : 'default'} className="uppercase text-[10px]">
                          {item.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-4 line-clamp-2 min-h-[2.5em]">{item.description}</p>

                      <div className="flex justify-between items-center text-xs text-muted-foreground mb-4">
                        <span>{new Date(item.date).toLocaleDateString()}</span>
                        <Badge variant="outline" className="text-xs">{item.status}</Badge>
                      </div>

                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        onClick={() => handleDeleteItem(item.id)}
                        title="Delete Item"
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Logout Button */}
            <div>
              <div className="hover:scale-102 transition-transform">
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  size="lg"
                  className="w-full hover:shadow-[0_0_30px_rgba(239,68,68,0.4)] transition-shadow"
                >
                  <LogOut size={20} className="mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </main>
        <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
          <AlertDialogContent className="glass-card border-white/10 text-foreground">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Delete Item?</AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                Are you sure you want to delete this item? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setItemToDelete(null)} className="border-white/10 hover:bg-white/10 text-white">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600 text-white border-0">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PageTransition>
  );
};

export default Profile;
