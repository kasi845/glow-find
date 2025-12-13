import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Sparkles } from 'lucide-react';
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
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary">
            <Sparkles size={16} />
            Hackathon Ready Project
          </span>
        </motion.div>

        <motion.h1
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 max-w-4xl leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <span className="text-foreground">Lose it.</span>{' '}
          <span className="gradient-text">Find it.</span>{' '}
          <span className="text-foreground">Claim it.</span>
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          The most beautiful way to report, track, and recover your lost belongings. 
          Connect with finders instantly.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Link to="/signup">
            <Button variant="hero" size="xl" className="group">
              Get Started Free
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="glass" size="xl">
              I Have an Account
            </Button>
          </Link>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-5xl w-full"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          {[
            { title: 'Report Items', desc: 'Quickly report lost or found items with photos and location', icon: '📝' },
            { title: 'Get Notified', desc: 'Receive instant notifications when someone claims your item', icon: '🔔' },
            { title: 'Chat & Recover', desc: 'Connect directly with finders and arrange safe pickups', icon: '💬' },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              className="glass-card p-6 text-left group cursor-pointer"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ delay: i * 0.1 }}
            >
              <span className="text-4xl mb-4 block">{feature.icon}</span>
              <h3 className="font-display font-semibold text-lg text-foreground mb-2 group-hover:gradient-text transition-all">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default Landing;