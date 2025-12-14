import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FloatingIcons } from '@/components/FloatingIcons';

const Landing = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-card to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,hsl(25_95%_60%/0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(320_80%_55%/0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(280_70%_50%/0.1),transparent_70%)]" />
      </div>

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
            <Button variant="glass" size="lg">
              Login
            </Button>
          </Link>
          <Link to="/signup">
            <Button variant="hero" size="lg">
              Sign Up
            </Button>
          </Link>
        </div>
      </motion.header>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-6 text-center">
        <motion.h1
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 max-w-4xl leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="text-foreground">Lose it.</span>{' '}
          <span className="gradient-text">Find it.</span>{' '}
          <span className="text-foreground">Claim it.</span>
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          🔍
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 mt-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link to="/login">
            <Button variant="glass" size="xl">
              Login
            </Button>
          </Link>
          <Link to="/signup">
            <Button variant="hero" size="xl">
              Sign Up
            </Button>
          </Link>
        </motion.div>
      </main>
    </div>
  );
};

export default Landing;
