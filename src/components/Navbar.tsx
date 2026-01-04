import { Search, Package, FileText, Bell, MessageCircle, User, Shield } from 'lucide-react';
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
  const { user } = useApp();
  const location = useLocation();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 glass-nav"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/home">
          <div
            className="flex items-center gap-2 hover:scale-105 hover:translate-x-1 transition-transform"
          >
            <span className="text-2xl">🔍</span>
            <span className="font-display font-bold text-lg gradient-text hidden sm:block">
              Lost & Found Tracker
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;
            return (
              <Link key={path} to={path}>
                <div
                  className={`relative p-2 sm:px-3 sm:py-2 rounded-xl flex items-center gap-2 transition-all duration-300 group ${isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                >
                  <Icon size={20} className="transition-transform group-hover:scale-110" />
                  <span className="hidden lg:block text-sm font-medium">{label}</span>

                  <span
                    className={`absolute left-2 right-2 bottom-0 h-[2px] rounded-full origin-left transition-transform duration-300 transform scale-x-0 group-hover:scale-x-100 ${isActive ? 'scale-x-100' : ''}`}
                    style={{
                      background: 'linear-gradient(90deg, hsl(320 80% 55%), hsl(25 95% 60%))',
                    }}
                  />

                  {isActive && (
                    <div
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full gradient-bg shadow-[0_0_15px_hsl(var(--primary)/0.8)]"
                    />
                  )}
                </div>
              </Link>
            );
          })}

          {/* Admin Link */}
          {user?.isAdmin && (
            <Link to="/admin">
              <div
                className="relative p-2 sm:px-3 sm:py-2 rounded-xl flex items-center gap-2 text-red-500 hover:bg-red-500/10 cursor-pointer hover:scale-110 transition-transform"
              >
                <Shield size={20} />
                <span className="hidden lg:block text-sm font-bold">Admin</span>
              </div>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
