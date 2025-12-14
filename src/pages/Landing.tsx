import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FloatingIcons } from '@/components/FloatingIcons';
import { FloatingOrbs } from '@/components/FloatingOrbs';
import { AnimatedTagline } from '@/components/AnimatedTagline';

const Landing = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-card to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,hsl(25_95%_60%/0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(320_80%_55%/0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(280_70%_50%/0.1),transparent_70%)]" />
      </div>

      <FloatingOrbs />
      <FloatingIcons />

      {/* Header */}
      <motion.header 
        className="relative z-10 flex justify-between items-center p-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center glow-primary">
            <Search className="text-primary-foreground" size={20} />
          </div>
          <span className="font-display font-bold text-xl text-foreground">
            Lost<span className="gradient-text">&</span>Found
          </span>
        </motion.div>

        <div className="flex gap-3">
          <Link to="/login">
            <Button variant="glass" size="lg" className="hover:scale-105 transition-transform">
              Login
            </Button>
          </Link>
          <Link to="/signup">
            <Button variant="hero" size="lg" className="hover:scale-105 transition-transform">
              Sign Up
            </Button>
          </Link>
        </div>
      </motion.header>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-180px)] px-6 text-center">
        <AnimatedTagline />

        <motion.p
          className="text-xl md:text-2xl text-muted-foreground mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          🔍
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 mt-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          <Link to="/login">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button variant="glass" size="xl" className="min-w-[140px]">
                Login
              </Button>
            </motion.div>
          </Link>
          <Link to="/signup">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button variant="hero" size="xl" className="min-w-[140px]">
                Sign Up
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer
        className="absolute bottom-0 left-0 right-0 z-10 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.6 }}
      >
        <div className="glass-card py-3 px-6 mx-auto w-fit">
          <p className="text-sm text-muted-foreground text-center">
            Made with <span className="text-destructive">❤️</span> by{' '}
            <span className="gradient-text font-medium">SRKR CSE-A Boys</span> | Hackathon 2025
          </p>
        </div>
      </motion.footer>
    </div>
  );
};

export default Landing;
