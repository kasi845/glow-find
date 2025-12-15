import { motion } from 'framer-motion';
import { Search, Package, FileText, Bell, MessageCircle, User, LogOut, Sun, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { useState, useEffect } from 'react';

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
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

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
            whileHover={{ scale: 1.05, x: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
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
                  className={`relative p-2 sm:px-3 sm:py-2 rounded-xl flex items-center gap-2 transition-all duration-300 group ${
                    isActive 
                      ? 'text-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  whileHover={{ 
                    scale: 1.1, 
                    x: 3,
                    backgroundColor: 'hsl(var(--muted) / 0.5)' 
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Icon size={20} />
                  <span className="hidden lg:block text-sm font-medium">{label}</span>
                  
                  {/* Magnetic underline animation */}
                  <motion.span 
                    className="absolute left-2 right-2 bottom-0 h-[2px] rounded-full origin-left"
                    style={{
                      background: 'linear-gradient(90deg, hsl(320 80% 55%), hsl(25 95% 60%))',
                    }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isActive ? 1 : 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {/* Active glow indicator */}
                  {isActive && (
                    <motion.div
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full gradient-bg"
                      layoutId="activeNavIndicator"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      style={{
                        boxShadow: '0 0 15px hsl(var(--primary) / 0.8)',
                      }}
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
          
          {/* Theme Toggle */}
          <motion.button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground transition-all duration-300 ml-1"
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <motion.div
              animate={{ rotate: isDark ? 0 : 180 }}
              transition={{ duration: 0.5 }}
            >
              {isDark ? <Moon size={20} /> : <Sun size={20} />}
            </motion.div>
          </motion.button>
          
          <motion.button
            onClick={logout}
            className="p-2 rounded-xl text-muted-foreground hover:text-destructive transition-all duration-300 ml-1"
            whileHover={{ scale: 1.1, x: 3, backgroundColor: 'hsl(var(--destructive) / 0.1)' }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <LogOut size={20} />
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};
