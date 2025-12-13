import { motion } from 'framer-motion';
import { Wallet, Key, Smartphone, Briefcase, Watch, Headphones, Camera, Glasses, Umbrella, CreditCard } from 'lucide-react';

const icons = [
  { Icon: Wallet, delay: 0, x: '5%', y: '15%', size: 32 },
  { Icon: Key, delay: 0.8, x: '85%', y: '12%', size: 28 },
  { Icon: Smartphone, delay: 1.5, x: '12%', y: '75%', size: 36 },
  { Icon: Briefcase, delay: 2.2, x: '88%', y: '68%', size: 30 },
  { Icon: Watch, delay: 3, x: '45%', y: '8%', size: 26 },
  { Icon: Headphones, delay: 3.8, x: '22%', y: '42%', size: 34 },
  { Icon: Camera, delay: 4.5, x: '75%', y: '38%', size: 32 },
  { Icon: Glasses, delay: 5.2, x: '92%', y: '88%', size: 28 },
  { Icon: Umbrella, delay: 6, x: '8%', y: '55%', size: 30 },
  { Icon: CreditCard, delay: 6.8, x: '65%', y: '82%', size: 26 },
  { Icon: Key, delay: 7.5, x: '35%', y: '28%', size: 24 },
  { Icon: Wallet, delay: 8.2, x: '58%', y: '58%', size: 28 },
];

export const FloatingIcons = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {icons.map(({ Icon, delay, x, y, size }, index) => (
        <motion.div
          key={index}
          className="absolute text-primary"
          style={{ left: x, top: y, opacity: 0.1 }}
          animate={{ 
            y: [0, -25, 0, 15, 0],
            x: [0, 10, 0, -10, 0],
            rotate: [0, 8, 0, -8, 0],
          }}
          transition={{
            duration: 12 + (index * 0.5),
            delay,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <Icon size={size} strokeWidth={1.5} />
        </motion.div>
      ))}
    </div>
  );
};
