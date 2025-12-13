import { motion } from 'framer-motion';
import { MapPin, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Item } from '@/contexts/AppContext';

interface ItemCardProps {
  item: Item;
  onClaim: () => void;
  index: number;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onClaim, index }) => {
  return (
    <motion.div
      className="glass-card overflow-hidden group"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
    >
      <div className="relative h-48 overflow-hidden">
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

      <div className="p-5">
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
          className="w-full"
        >
          Claim Item
        </Button>
      </div>
    </motion.div>
  );
};
