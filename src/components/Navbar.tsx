import { motion } from 'framer-motion';
import { Search, Package, FileText, Bell, MessageCircle, User, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';

const navItems = [
  { path: '/lost', icon: Search, label: 'Lost Items' },
  { path: '/found', icon: Package, label: 'Found Items' },
  { path: '/report', icon: FileText, label: 'Report' },
  { path: '/notifications', icon: Bell, label: 'Notifications' },
  { path: '/messages', icon: MessageCircle, label: 'Messages' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export const Navbar = () => {
  const location = useLocation();
  const { logout } = useApp();

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 glass-nav"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/home">
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-2xl">🔍</span>
            <span className="font-display font-bold text-lg gradient-text hidden sm:block">
              Lost & Found Tracker
            </span>
          </motion.div>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;
            return (
              <Link key={path} to={path}>
                <motion.div
                  className={`relative p-2 sm:px-3 sm:py-2 rounded-xl flex items-center gap-2 transition-all duration-300 ${
                    isActive 
                      ? 'text-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  whileHover={{ scale: 1.05, backgroundColor: 'hsl(var(--muted) / 0.5)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon size={20} />
                  <span className="hidden lg:block text-sm font-medium">{label}</span>
                  
                  {/* Active indicator - glowing bottom line */}
                  {isActive && (
                    <motion.div
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full gradient-bg"
                      layoutId="activeNavIndicator"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      style={{
                        boxShadow: '0 0 10px hsl(var(--primary) / 0.6)',
                      }}
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
          
          <motion.button
            onClick={logout}
            className="p-2 rounded-xl text-muted-foreground hover:text-destructive transition-all duration-300 ml-2"
            whileHover={{ scale: 1.05, backgroundColor: 'hsl(var(--destructive) / 0.1)' }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut size={20} />
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};
