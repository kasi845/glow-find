import { Package, Search } from 'lucide-react';

interface EmptyStateProps {
  type?: 'notifications' | 'messages' | 'items';
  title: string;
  description: string;
}

export const EmptyState = ({ type = 'notifications', title, description }: EmptyStateProps) => {
  return (
    <div
      className="flex flex-col items-center justify-center text-center px-4"
    >
      {/* 3D-style illustration */}
      <div
        className="relative mb-8 hover:-translate-y-2 transition-transform duration-500 ease-in-out"
      >
        <div className="w-32 h-32 rounded-3xl gradient-bg opacity-20 blur-xl absolute inset-0" />
        <div className="relative w-32 h-32 glass-card rounded-3xl flex items-center justify-center">
          {type === 'notifications' ? (
            <div className="animate-pulse">
              <Package className="text-primary" size={48} />
            </div>
          ) : (
            <div className="animate-pulse">
              <Search className="text-primary" size={48} />
            </div>
          )}
        </div>

        {/* Floating particles - CSS only */}
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/40 animate-ping"
            style={{
              top: `${20 + i * 30}%`,
              left: `${10 + i * 40}%`,
              animationDuration: '3s',
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
      </div>

      <h2
        className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3"
      >
        {title}
      </h2>
      <p
        className="text-muted-foreground text-base md:text-lg max-w-md"
      >
        {description}
      </p>
    </div>
  );
};
