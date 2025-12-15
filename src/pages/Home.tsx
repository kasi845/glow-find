import { motion } from 'framer-motion';
import { useState } from 'react';
import { Search, Package, Wallet, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { FloatingIcons } from '@/components/FloatingIcons';
import { PageTransition } from '@/components/PageTransition';
import { FilterTabs } from '@/components/FilterTabs';
import { AlertBanner } from '@/components/AlertBanner';
import { LumiChatbot } from '@/components/LumiChatbot';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';

const Home = () => {
  const { user, items } = useApp();
  const [activeFilter, setActiveFilter] = useState('All');
  
  const lostItems = items.filter(i => i.type === 'lost');
  const foundItems = items.filter(i => i.type === 'found');

  const filteredItems = items.filter(item => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Lost') return item.type === 'lost';
    if (activeFilter === 'Found') return item.type === 'found';
    if (activeFilter === 'Claimed') return item.status === 'claimed';
    return true;
  });

  const stats = [
    { 
      icon: Search, 
      label: 'Lost Items', 
      value: lostItems.length, 
      color: 'from-orange-500 to-red-500',
      floatingIcon: Wallet 
    },
    { 
      icon: Package, 
      label: 'Found Items', 
      value: foundItems.length, 
      color: 'from-green-500 to-emerald-500',
      floatingIcon: Smartphone 
    },
  ];

  const firstName = user?.name?.split(' ')[0] || 'User';

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <FloatingIcons />
        <Navbar />
      
      <main className="pt-24 pb-12 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Animated Welcome Section */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.span
              className="font-display text-4xl md:text-5xl font-bold text-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Welcome back,{' '}
            </motion.span>
            <motion.span
              className="font-display text-4xl md:text-5xl font-bold gradient-text inline-block"
              initial={{ opacity: 0, x: -30, filter: 'blur(10px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {firstName}
            </motion.span>
            <motion.p 
              className="text-muted-foreground text-lg mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Here's what's happening with your items today
            </motion.p>
          </motion.div>

          {/* Interactive Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-12">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="glass-card p-6 relative overflow-hidden group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ 
                  scale: 1.02, 
                  y: -8,
                  boxShadow: '0 20px 40px -15px hsl(var(--primary) / 0.3)'
                }}
              >
                {/* Floating icon in background */}
                <motion.div
                  className="absolute top-2 right-2 text-muted-foreground/10"
                  animate={{ y: [0, -5, 0], rotate: [0, 5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <stat.floatingIcon size={60} />
                </motion.div>
                
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <stat.icon className="text-primary-foreground" size={24} />
                </div>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
                <p className="font-display text-3xl font-bold text-foreground">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Report Button with Ripple Effect */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link to="/report">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button variant="gradient" size="xl" className="w-full md:w-auto relative overflow-hidden group">
                  <motion.span
                    className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500"
                    style={{ transformOrigin: 'center' }}
                  />
                  <span className="relative z-10">📝 Report an Item</span>
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Recent Activity with Filter Tabs */}
          <motion.div
            className="glass-card p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h2 className="font-display text-2xl font-bold">Recent Items</h2>
              <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.slice(0, 6).map((item, i) => (
                <motion.div
                  key={item.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">{item.title}</h3>
                    <p className="text-sm text-muted-foreground truncate">{item.location}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                    item.type === 'lost' 
                      ? 'bg-destructive/20 text-destructive' 
                      : 'bg-green-500/20 text-green-500'
                  }`}>
                    {item.type === 'lost' ? '🔴 Lost' : '🟢 Found'}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Alert Banner */}
          <div className="mt-8">
            <AlertBanner />
          </div>
        </div>
      </main>

      {/* LUMI Chatbot - Only visible after login */}
      <LumiChatbot />
      </div>
    </PageTransition>
  );
};

export default Home;
