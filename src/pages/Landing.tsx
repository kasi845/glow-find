import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FloatingIcons } from '@/components/FloatingIcons';
import { AuroraBackground } from '@/components/AuroraBackground';
import { CinematicHero } from '@/components/CinematicHero';
import { AnimatedFooter } from '@/components/AnimatedFooter';
import CustomCursor from '@/components/CustomCursor';

const Landing = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Custom animated cursor */}
      <CustomCursor />
      
      {/* Aurora animated background */}
      <AuroraBackground />
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
          whileHover={{ scale: 1.05, x: 5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <motion.div 
            className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center"
            animate={{
              boxShadow: [
                '0 0 20px hsl(25 95% 60% / 0.4)',
                '0 0 40px hsl(320 80% 55% / 0.5)',
                '0 0 20px hsl(25 95% 60% / 0.4)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Search className="text-primary-foreground" size={20} />
          </motion.div>
          <span className="font-display font-bold text-xl text-foreground">
            Lost<span className="gradient-text">&</span>Found
          </span>
        </motion.div>

        <div className="flex gap-3">
          <Link to="/login">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button 
                variant="glass" 
                size="lg" 
                className="relative overflow-hidden group"
              >
                <span className="relative z-10">Login</span>
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: 'linear-gradient(90deg, transparent, hsl(0 0% 100% / 0.1), transparent)',
                  }}
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </Button>
            </motion.div>
          </Link>
          <Link to="/signup">
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                variant="hero" 
                size="lg" 
                className="shimmer-btn"
                style={{
                  boxShadow: '0 0 30px hsl(320 80% 55% / 0.4)',
                }}
              >
                Sign Up
              </Button>
            </motion.div>
          </Link>
        </div>
      </motion.header>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-220px)] px-6">
        <CinematicHero />

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mt-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2 }}
        >
          <Link to="/login">
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                variant="glass" 
                size="xl" 
                className="min-w-[160px] group relative overflow-hidden"
              >
                <span className="relative z-10">Login</span>
              </Button>
            </motion.div>
          </Link>
          <Link to="/signup">
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                variant="hero" 
                size="xl" 
                className="min-w-[160px] shimmer-btn"
                style={{
                  boxShadow: '0 0 40px hsl(320 80% 55% / 0.5)',
                }}
              >
                Get Started
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </main>

      {/* Animated Footer */}
      <AnimatedFooter />
    </div>
  );
};

export default Landing;
