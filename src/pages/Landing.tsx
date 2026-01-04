import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FloatingIcons } from '@/components/FloatingIcons';
import { AuroraBackground } from '@/components/AuroraBackground';
import { CinematicHero } from '@/components/CinematicHero';
import { AnimatedFooter } from '@/components/AnimatedFooter';
import { AboutSection } from '@/components/AboutSection';
import CustomCursor from '@/components/CustomCursor';

const Landing = () => {
  const [showAbout, setShowAbout] = useState(false);

  const scrollToAbout = () => {
    setShowAbout(true);
    setTimeout(() => {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Custom animated cursor */}
      <CustomCursor />

      {/* Aurora animated background */}
      <AuroraBackground />
      <FloatingIcons />

      {/* Header */}
      <header
        className="relative z-10 flex justify-between items-center p-6"
      >
        <div
          className="flex items-center gap-3"
        >
          <div
            className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center"
            style={{ boxShadow: '0 0 20px hsl(25 95% 60% / 0.4)' }}
          >
            <Search className="text-primary-foreground" size={20} />
          </div>
          <span className="font-display font-bold text-xl text-foreground">
            Lost<span className="gradient-text">&</span>Found
          </span>
        </div>

        <div className="flex gap-3">
          <div>
            <Button
              variant="glass"
              size="lg"
              onClick={scrollToAbout}
              className="relative overflow-hidden group"
            >
              <Info size={16} className="mr-2" />
              <span className="relative z-10">About</span>
            </Button>
          </div>
          <Link to="/login">
            <div>
              <Button
                variant="glass"
                size="lg"
                className="relative overflow-hidden group"
              >
                <span className="relative z-10">Login</span>
              </Button>
            </div>
          </Link>
          <Link to="/signup">
            <div>
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
            </div>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-220px)] px-6">
        <CinematicHero />

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row gap-4 mt-12"
        >
          <Link to="/login">
            <div>
              <Button
                variant="glass"
                size="xl"
                className="min-w-[160px] group relative overflow-hidden"
              >
                <span className="relative z-10">Login</span>
              </Button>
            </div>
          </Link>
          <Link to="/signup">
            <div>
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
            </div>
          </Link>
        </div>
      </main>

      {/* About Section - shows when scrolled or clicked */}
      {showAbout && <AboutSection />}

      {/* Animated Footer */}
      <AnimatedFooter />
    </div>
  );
};

export default Landing;
