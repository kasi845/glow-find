import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Wallet, Key, Smartphone, Briefcase, Watch, Headphones, Camera, Glasses, Umbrella, CreditCard } from 'lucide-react';

const icons = [
  { Icon: Wallet, delay: 0, x: '5%', y: '15%', size: 32 },
  { Icon: Key, delay: 0.3, x: '85%', y: '12%', size: 28 },
  { Icon: Smartphone, delay: 0.6, x: '12%', y: '75%', size: 36 },
  { Icon: Briefcase, delay: 0.9, x: '88%', y: '68%', size: 30 },
  { Icon: Watch, delay: 1.2, x: '45%', y: '8%', size: 26 },
  { Icon: Headphones, delay: 1.5, x: '22%', y: '42%', size: 34 },
  { Icon: Camera, delay: 1.8, x: '75%', y: '38%', size: 32 },
  { Icon: Glasses, delay: 2.1, x: '92%', y: '88%', size: 28 },
  { Icon: Umbrella, delay: 2.4, x: '8%', y: '55%', size: 30 },
  { Icon: CreditCard, delay: 2.7, x: '65%', y: '82%', size: 26 },
];

export const FloatingIcons = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    setPrefersReducedMotion(
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }, []);

  // Disable on mobile or reduced motion
  if (isMobile || prefersReducedMotion) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {icons.map(({ Icon, delay, x, y, size }, index) => (
        <motion.div
          key={index}
          className="absolute text-primary"
          style={{ left: x, top: y }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.08, y: 0 }}
          transition={{
            duration: 1,
            delay,
            ease: 'easeOut'
          }}
        >
          <Icon size={size} strokeWidth={1.5} />
        </motion.div>
      ))}
    </div>
  );
};
