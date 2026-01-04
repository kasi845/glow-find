import { useState, useEffect } from 'react';
import { Search, Package, Wallet, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { FloatingIcons } from '@/components/FloatingIcons';
import { PageTransition } from '@/components/PageTransition';
import { FilterTabs } from '@/components/FilterTabs';
import { AlertBanner } from '@/components/AlertBanner';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';

import { useNavigate } from 'react-router-dom';

import { apiGetGlobalStats } from '@/lib/api';

const Home = () => {
  const { user, items } = useApp();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [globalStats, setGlobalStats] = useState({ lost: 0, found: 0 });

  useEffect(() => {
    apiGetGlobalStats().then(data => {
      if (data) {
        setGlobalStats({ lost: data.total_lost || 0, found: data.total_found || 0 });
      }
    });
  }, []);

  const filteredItems = items.filter(item => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Lost') return item.type === 'lost';
    if (activeFilter === 'Found') return item.type === 'found';
    if (activeFilter === 'Claimed') return item.status === 'completed' || item.status === 'accepted';
    return true;
  });

  const handleItemClick = (item: any) => {
    if (item.type === 'lost') navigate('/lost');
    else navigate('/found');
  };

  const stats = [
    {
      icon: Search,
      label: 'Lost Items',
      value: globalStats.lost,
      color: 'from-orange-500 to-red-500',
      floatingIcon: Wallet
    },
    {
      icon: Package,
      label: 'Found Items',
      value: globalStats.found,
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
            <div
              className="mb-12"
            >
              <span
                className="font-display text-4xl md:text-5xl font-bold text-foreground"
              >
                Welcome back,{' '}
              </span>
              <span
                className="font-display text-4xl md:text-5xl font-bold gradient-text inline-block"
              >
                {firstName}
              </span>
              <p
                className="text-muted-foreground text-lg mt-4"
              >
                Here's what's happening with your items today
              </p>
            </div>

            {/* Interactive Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-12">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="glass-card p-6 relative overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-300"
                >
                  {/* Floating icon in background */}
                  <div
                    className="absolute top-2 right-2 text-muted-foreground/10"
                  >
                    <stat.floatingIcon size={60} />
                  </div>

                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <stat.icon className="text-primary-foreground" size={24} />
                  </div>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                  <p className="font-display text-3xl font-bold text-foreground">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Report Button with Ripple Effect */}
            <div
              className="mb-12"
            >
              <Link to="/report">
                <div className="transform hover:scale-105 transition-transform active:scale-95 duration-200">
                  <Button variant="gradient" size="xl" className="w-full md:w-auto relative overflow-hidden group">
                    <span className="relative z-10">📝 Report an Item</span>
                  </Button>
                </div>
              </Link>
            </div>

            {/* Recent Activity with Filter Tabs */}
            <div
              className="glass-card p-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="font-display text-2xl font-bold">Recent Items</h2>
                <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.slice(0, 6).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer hover:scale-102 transform duration-200"
                    onClick={() => handleItemClick(item)}
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
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${item.type === 'lost'
                      ? 'bg-destructive/20 text-destructive'
                      : 'bg-green-500/20 text-green-500'
                      }`}>
                      {item.type === 'lost' ? '🔴 Lost' : '🟢 Found'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Alert Banner */}
            <div className="mt-8">
              <AlertBanner />
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default Home;
