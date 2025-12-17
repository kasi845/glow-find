import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X, Handshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useApp, Item } from '@/contexts/AppContext';

interface FoundReportModalProps {
  item: Item | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FoundReportModal: React.FC<FoundReportModalProps> = ({ item, isOpen, onClose }) => {
  const { submitClaim, user } = useApp();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;

    submitClaim({
      itemId: item.id,
      itemTitle: item.title,
      claimerName: name,
      claimerEmail: email,
      claimerPhone: phone,
      proofImage: message,
    });

    toast({
      title: "Report Sent! 🤝",
      description: "The owner has been notified. They'll reach out if they accept.",
    });

    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            className="relative glass-card w-full max-w-md p-6 border border-pink-500/20"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500">
                <Handshake className="text-white" size={24} />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-pink-400">
                  Report Found Item
                </h2>
                <p className="text-sm text-muted-foreground">
                  Let the owner know you found their item
                </p>
              </div>
            </div>

            {item && (
              <div className="mb-6 p-3 rounded-lg bg-muted/50 border border-border">
                <p className="text-sm text-muted-foreground">Item:</p>
                <p className="font-medium text-foreground">{item.title}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  required
                  className="bg-muted/50 border-border"
                />
              </div>

              <div>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="bg-muted/50 border-border"
                />
              </div>

              <div>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone (optional)"
                  className="bg-muted/50 border-border"
                />
              </div>

              <div>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Where / when you found it..."
                  required
                  className="bg-muted/50 border-border min-h-[100px]"
                />
              </div>

              <Button
                type="submit"
                variant="gradient"
                className="w-full shimmer-btn"
              >
                Send to Owner
              </Button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
