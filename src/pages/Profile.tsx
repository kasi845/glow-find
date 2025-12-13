import { motion } from 'framer-motion';
import { useState } from 'react';
import { User, Mail, Edit, LogOut, Package, Search, Check, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApp } from '@/contexts/AppContext';
import { toast } from '@/hooks/use-toast';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  const handleSave = () => {
    updateUser(editData);
    setIsEditing(false);
    toast({
      title: "Profile Updated! ✨",
      description: "Your changes have been saved.",
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const stats = [
    { 
      label: 'Items Reported', 
      icon: Search,
      inProcess: user?.itemsReported.inProcess || 0,
      completed: user?.itemsReported.completed || 0,
      color: 'from-orange-500 to-red-500'
    },
    { 
      label: 'Items Found', 
      icon: Package,
      inProcess: user?.itemsFound.inProcess || 0,
      completed: user?.itemsFound.completed || 0,
      color: 'from-green-500 to-emerald-500'
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12 px-6">
        <div className="container mx-auto max-w-2xl">
          <motion.div
            className="mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Your Profile</span>
            </h1>
          </motion.div>

          {/* Profile Card */}
          <motion.div
            className="glass-card p-8 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-col items-center mb-8">
              <motion.div
                className="relative mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <img 
                  src={user?.avatar} 
                  alt={user?.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary/30"
                />
                <div className="absolute bottom-0 right-0 w-10 h-10 rounded-full gradient-bg flex items-center justify-center border-4 border-card">
                  <User size={18} className="text-primary-foreground" />
                </div>
              </motion.div>

              {isEditing ? (
                <div className="w-full space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <Input
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-3 justify-center">
                    <Button onClick={handleSave} variant="gradient">
                      Save Changes
                    </Button>
                    <Button onClick={() => setIsEditing(false)} variant="outline">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                    {user?.name}
                  </h2>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Mail size={16} />
                    {user?.email}
                  </p>
                  <Button 
                    onClick={() => setIsEditing(true)} 
                    variant="glass" 
                    className="mt-4"
                  >
                    <Edit size={16} className="mr-2" />
                    Edit Profile
                  </Button>
                </>
              )}
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="glass-card p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                  <stat.icon className="text-primary-foreground" size={24} />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-4">
                  {stat.label}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Clock size={14} />
                      In Process
                    </span>
                    <span className="font-medium text-foreground">{stat.inProcess}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Check size={14} />
                      Completed
                    </span>
                    <span className="font-medium text-foreground">{stat.completed}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Logout Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button 
              onClick={handleLogout}
              variant="destructive"
              size="lg"
              className="w-full hover:glow-primary"
            >
              <LogOut size={20} className="mr-2" />
              Logout
            </Button>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Profile;