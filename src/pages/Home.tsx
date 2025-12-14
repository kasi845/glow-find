import { motion } from 'framer-motion';
import { Search, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { FloatingIcons } from '@/components/FloatingIcons';
import { PageTransition } from '@/components/PageTransition';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';

const Home = () => {
  const { user, items } = useApp();
  const lostItems = items.filter(i => i.type === 'lost');
  const foundItems = items.filter(i => i.type === 'found');

  const stats = [
    { icon: Search, label: 'Lost Items', value: lostItems.length, color: 'from-orange-500 to-red-500' },
    { icon: Package, label: 'Found Items', value: foundItems.length, color: 'from-green-500 to-emerald-500' },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <FloatingIcons />
        <Navbar />
      
      <main className="pt-24 pb-12 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Welcome Section */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0] || 'User'}</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Here's what's happening with your items today
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-12">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="glass-card p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                  <stat.icon className="text-primary-foreground" size={24} />
                </div>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
                <p className="font-display text-3xl font-bold text-foreground">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Report Button */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link to="/report">
              <Button variant="gradient" size="xl" className="w-full md:w-auto">
                📝 Report an Item
              </Button>
            </Link>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            className="glass-card p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="font-display text-2xl font-bold mb-6">Recent Items</h2>
            <div className="space-y-4">
              {items.slice(0, 4).map((item, i) => (
                <motion.div
                  key={item.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.location}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.type === 'lost' 
                      ? 'bg-destructive/20 text-destructive' 
                      : 'bg-green-500/20 text-green-500'
                  }`}>
                    {item.type === 'lost' ? 'Lost' : 'Found'}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
      </div>
    </PageTransition>
  );
};

export default Home;
