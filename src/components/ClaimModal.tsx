import { X, Upload } from 'lucide-react';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
    description: '',
    proofImage: ''
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image under 5MB",
          variant: "destructive",
        });
        return;
      }

      // Validate file type
      if (!file.type.match(/^image\/(jpeg|png|jpg)$/)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a JPG or PNG image",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;

    try {
      await submitClaim({
        itemId: item.id,
        itemTitle: item.title,
        claimerName: formData.name,
        claimerEmail: formData.email,
        claimerPhone: formData.phone,
        proofImage: imagePreview || formData.proofImage || 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400',
        description: formData.description,
      } as any);

      toast({
        title: "Claim Submitted! 🎉",
        description: "The owner will be notified and can accept your claim.",
      });

      setFormData({ name: '', email: '', phone: '', description: '', proofImage: '' });
      setImagePreview(null);
      onClose();
    } catch (err: any) {
      const errorMessage = err?.message || err?.toString() || (typeof err === 'string' ? err : "Failed to submit claim");
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  if (!isOpen || !item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="relative glass-card p-6 w-full max-w-md max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
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

          {/* Description field */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Describe how you know this item is yours
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe unique marks, contents, scratches, etc. that prove ownership..."
              required
              className="min-h-[100px]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Upload Proof Image</label>
            <div
              className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImagePreview(null);
                    }}
                    className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-black/70"
                  >
                    <X size={14} className="text-white" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="mx-auto mb-2 text-muted-foreground" size={24} />
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    JPG, PNG • Max 5MB
                  </p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Upload proof (ID, bill, unique mark on item)
            </p>
          </div>

          <p className="text-xs text-muted-foreground/80">
            ⚠️ False claims may result in account suspension.
          </p>

          <Button type="submit" variant="hero" className="w-full">
            Submit Claim
          </Button>
        </form>
      </div>
    </div>
  );
};
