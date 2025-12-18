import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { User, Mail, Edit, LogOut, Package, Search, Check, Clock, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { FloatingIcons } from '@/components/FloatingIcons';
import { PageTransition } from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApp } from '@/contexts/AppContext';
import { toast } from '@/hooks/use-toast';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser, claimRequests } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || ''
  });

  const handleSave = () => {
    updateUser({ ...editData, email: user?.email || '' });
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

  const acceptedClaims = claimRequests.filter(c => c.status === 'accepted').length;

  const stats = [
    { 
      label: 'Items Reported', 
      icon: Search,
      value: (user?.itemsReported.inProcess || 0) + (user?.itemsReported.completed || 0),
      subLabel: `${user?.itemsReported.inProcess || 0} active`,
      color: 'from-orange-500 to-red-500'
    },
    { 
      label: 'Items Found', 
      icon: Package,
      value: (user?.itemsFound.inProcess || 0) + (user?.itemsFound.completed || 0),
      subLabel: `${user?.itemsFound.inProcess || 0} active`,
      color: 'from-green-500 to-emerald-500'
    },
    { 
      label: 'Claims Accepted', 
      icon: Check,
      value: acceptedClaims,
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
              {/* Editable Avatar */}
              <motion.div
                className="relative mb-6 group cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                <img 
                  src={user?.avatar} 
                  alt={user?.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary/30 transition-all group-hover:border-primary/60"
                />
                {/* Camera overlay */}
                <motion.div 
                  className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  whileHover={{ scale: 1.05 }}
                >
                  <Camera size={32} className="text-white" />
                </motion.div>
                <motion.div 
                  className="absolute bottom-0 right-0 w-10 h-10 rounded-full gradient-bg flex items-center justify-center border-4 border-card"
                  whileHover={{ scale: 1.1 }}
                >
                  <User size={18} className="text-primary-foreground" />
                </motion.div>
              </motion.div>

              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.div 
                    className="w-full space-y-4"
                    key="editing"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
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
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button onClick={handleSave} variant="gradient">
                          Save Changes
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button onClick={() => setIsEditing(false)} variant="outline">
                          Cancel
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="display"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="text-center"
                  >
                    <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                      {user?.name}
                    </h2>
                    <p className="text-muted-foreground flex items-center justify-center gap-2">
                      <Mail size={16} />
                      {user?.email}
                    </p>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        onClick={() => setIsEditing(true)} 
                        variant="glass" 
                        className="mt-4"
                      >
                        <Edit size={16} className="mr-2" />
                        Edit Profile
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Stats - 3 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="glass-card p-6 cursor-pointer overflow-hidden relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -5,
                  boxShadow: '0 20px 40px -15px hsl(var(--primary) / 0.3)'
                }}
              >
                {/* Glow effect */}
                <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full bg-gradient-to-br ${stat.color} opacity-20 blur-2xl`} />
                
                <motion.div 
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg`}
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <stat.icon className="text-primary-foreground" size={24} />
                </motion.div>
                <h3 className="font-display font-semibold text-foreground mb-1">
                  {stat.label}
                </h3>
                <p className="text-3xl font-bold gradient-text mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.subLabel}</p>
              </motion.div>
            ))}
          </div>

          {/* Logout Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                onClick={handleLogout}
                variant="destructive"
                size="lg"
                className="w-full hover:shadow-[0_0_30px_rgba(239,68,68,0.4)] transition-shadow"
              >
                <LogOut size={20} className="mr-2" />
                Logout
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </main>
      </div>
    </PageTransition>
  );
};

export default Profile;
