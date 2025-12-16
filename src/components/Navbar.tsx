import { motion } from 'framer-motion';
import { Bell, MessageSquare, User, Search } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const rightIcons = [
  { path: '/notifications', icon: Bell },
  { path: '/messages', icon: MessageSquare },
  { path: '/profile', icon: User },
];

export const Navbar = () => {
  const location = useLocation();

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-b border-primary/10"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      <div className="container mx-auto px-5 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/home">
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="bg-gradient-to-tr from-orange-500 via-pink-500 to-purple-500 p-2 rounded-xl">
              <Search className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-bold text-lg text-foreground hidden sm:block">
              Lost<span className="text-primary">&</span>Found
            </h1>
          </motion.div>
        </Link>

        {/* Right Icons */}
        <div className="flex items-center gap-6">
          {rightIcons.map(({ path, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link key={path} to={path}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <Icon 
                    size={22} 
                    className={`transition-colors ${
                      isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                    }`} 
                  />
                  {isActive && (
                    <motion.div
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                      layoutId="activeNavDot"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
};
