import { MapPin, Calendar, User, Handshake, CheckCircle, Ban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Item } from '@/contexts/AppContext';

interface ItemCardProps {
  item: Item;
  onClaim: () => void;
  index: number;
  buttonText?: string;
  buttonIcon?: 'claim' | 'found';
  currentUserName?: string;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onClaim,
  index,
  buttonText = 'Claim Item',
  buttonIcon = 'claim',
  currentUserName
}) => {
  // Check if this is the user's own item
  const isOwnItem = currentUserName && item.userName === currentUserName;

  return (
    <div
      className="glass-card overflow-hidden group cursor-pointer flex flex-col h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 transform perspective-1000"
    >
      {/* Fixed height image section */}
      <div className="relative h-44 w-full overflow-hidden flex-shrink-0">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.type === 'lost'
            ? 'bg-destructive/80 text-destructive-foreground'
            : 'bg-green-500/80 text-primary-foreground'
            }`}>
            {item.type === 'lost' ? 'Lost' : 'Found'}
          </span>
        </div>
      </div>

      {/* Content section with flex-grow */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-display font-semibold text-lg text-foreground mb-2 line-clamp-1">
          {item.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {item.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin size={14} className="text-primary flex-shrink-0" />
            <span className="line-clamp-1">{item.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar size={14} className="text-secondary flex-shrink-0" />
            <span>{new Date(item.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User size={14} className="text-accent flex-shrink-0" />
            <span>{item.userName}</span>
          </div>
        </div>

        {/* Spacer to push button to bottom */}
        <div className="flex-grow" />

        <Button
          onClick={isOwnItem ? undefined : onClaim}
          variant={isOwnItem ? "outline" : "gradient"}
          disabled={isOwnItem}
          className={`w-full flex items-center justify-center gap-2 mt-auto ${isOwnItem
            ? 'cursor-not-allowed opacity-50 hover:opacity-50'
            : 'shimmer-btn'
            }`}
          title={isOwnItem ? "You cannot claim your own item" : buttonText}
        >
          {isOwnItem ? (
            <>
              <Ban size={18} />
              Your Item
            </>
          ) : (
            <>
              {buttonIcon === 'found' ? (
                <Handshake size={18} />
              ) : (
                <CheckCircle size={18} />
              )}
              {buttonText}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};