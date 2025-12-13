import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApp, Item } from '@/contexts/AppContext';
import { toast } from '@/hooks/use-toast';

interface ClaimModalProps {
  item: Item | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({ item, isOpen, onClose }) => {
  const { submitClaim } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    proofImage: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;

    submitClaim({
      itemId: item.id,
      itemTitle: item.title,
      claimerName: formData.name,
      claimerEmail: formData.email,
      claimerPhone: formData.phone,
      proofImage: formData.proofImage || 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400'
    });

    toast({
      title: "Claim Submitted! 🎉",
      description: "The owner will be notified and can accept your claim.",
    });

    setFormData({ name: '', email: '', phone: '', proofImage: '' });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && item && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            className="relative glass-card p-6 w-full max-w-md"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
            >
              <X size={20} />
            </button>

            <h2 className="font-display text-2xl font-bold gradient-text mb-2">
              Claim Item
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              Submit your claim for <span className="text-foreground font-medium">{item.title}</span>
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Your Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 234 567 8900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Upload Proof Image</label>
                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="mx-auto mb-2 text-muted-foreground" size={24} />
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                </div>
              </div>

              <Button type="submit" variant="hero" className="w-full">
                Submit Claim
              </Button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
