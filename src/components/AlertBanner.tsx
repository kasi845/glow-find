import { AlertTriangle } from 'lucide-react';

export const AlertBanner = () => {
  return (
    <div
      className="glass-card p-4 flex items-center gap-3 border-l-4 border-primary animate-in fade-in slide-in-from-bottom-4 duration-700"
    >
      <div
        className="animate-pulse"
      >
        <AlertTriangle className="text-primary" size={24} />
      </div>
      <p className="text-muted-foreground">
        <span className="text-foreground font-medium">Stay alert!</span> Found something? Report it fast.
      </p>
    </div>
  );
};
