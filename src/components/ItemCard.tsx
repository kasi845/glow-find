import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { MapPin, Calendar, User, Handshake, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Item } from '@/contexts/AppContext';

interface ItemCardProps {
  item: Item;
  onClaim: () => void;
  index: number;
  buttonText?: string;
  buttonIcon?: 'claim' | 'found';
}

export const ItemCard: React.FC<ItemCardProps> = ({ 
  item, 
  onClaim, 
  index,
  buttonText = 'Claim Item',
  buttonIcon = 'claim'
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-100, 100], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-8, 8]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className="glass-card overflow-hidden group cursor-pointer"
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative h-48 overflow-hidden" style={{ transform: 'translateZ(20px)' }}>
        <img 
          src={item.image} 
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            item.type === 'lost' 
              ? 'bg-destructive/80 text-destructive-foreground' 
              : 'bg-green-500/80 text-primary-foreground'
          }`}>
            {item.type === 'lost' ? 'Lost' : 'Found'}
          </span>
        </div>
      </div>

      <div className="p-5" style={{ transform: 'translateZ(30px)' }}>
        <h3 className="font-display font-semibold text-lg text-foreground mb-2 line-clamp-1">
          {item.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {item.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin size={14} className="text-primary" />
            <span className="line-clamp-1">{item.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar size={14} className="text-secondary" />
            <span>{new Date(item.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User size={14} className="text-accent" />
            <span>{item.userName}</span>
          </div>
        </div>

        <Button 
          onClick={onClaim}
          variant="gradient"
          className="w-full shimmer-btn flex items-center justify-center gap-2"
        >
          {buttonIcon === 'found' ? (
            <Handshake size={18} />
          ) : (
            <CheckCircle size={18} />
          )}
          {buttonText}
        </Button>
      </div>
    </motion.div>
  );
};