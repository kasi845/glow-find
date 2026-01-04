import { useState } from 'react';
import { FileText, MapPin, Calendar, Phone, Upload, Tag } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { FloatingIcons } from '@/components/FloatingIcons';
import { PageTransition } from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApp } from '@/contexts/AppContext';
import { toast } from '@/hooks/use-toast';
import { apiUploadImage } from '@/lib/api';

const categories = ['Electronics', 'Wallet', 'Keys', 'Bags', 'Documents', 'Jewelry', 'Clothing', 'Other'];

const Report = () => {
  const { reportItem } = useApp();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Electronics',
    location: '',
    date: '',
    contact: '',
    image: '',
    type: 'lost' as 'lost' | 'found'
  });
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = formData.image || 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400';

      if (file) {
        const uploaded = await apiUploadImage(file);
        imageUrl = uploaded.url;
      }

      await reportItem({
        ...formData,
        image: imageUrl,
      });

      toast({
        title: "Item Reported! 🎉",
        description: `Your ${formData.type} item has been sent.`,
      });

      setFormData({
        title: '',
        description: '',
        category: 'Electronics',
        location: '',
        date: '',
        contact: '',
        image: '',
        type: 'lost'
      });
      setFile(null);
    } catch (err: any) {
      toast({
        title: "Unable to report item",
        description: err?.message || "Please try again",
        variant: "destructive"
      });
    }
  };

  const inputFields = [
    { name: 'title', label: 'Item Title', icon: Tag, placeholder: 'e.g., Black Leather Wallet' },
    { name: 'location', label: 'Location', icon: MapPin, placeholder: 'Where was it lost/found?' },
    { name: 'date', label: 'Date', icon: Calendar, placeholder: '', type: 'date' },
    { name: 'contact', label: 'Contact', icon: Phone, placeholder: 'Your phone or email' },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <FloatingIcons />
        <Navbar />

        <main className="pt-24 pb-12 px-6">
          <div className="container mx-auto max-w-2xl">
            <div
            >
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-center">
                <span className="gradient-text">Report an Item</span>
              </h1>
              <p className="text-muted-foreground text-lg text-center mb-12">
                Help others find their belongings or report yours as lost
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="glass-card p-8 space-y-6"
            >
              {/* Type Toggle */}
              <div className="flex gap-4 p-2 rounded-xl bg-muted/30">
                {['lost', 'found'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: type as 'lost' | 'found' })}
                    className={`flex-1 py-3 rounded-lg font-medium transition-all duration-300 capitalize ${formData.type === type
                        ? 'gradient-bg text-primary-foreground glow-primary'
                        : 'text-muted-foreground hover:text-foreground'
                      }`}
                  >
                    {type === 'lost' ? '🔍 Lost Item' : '📦 Found Item'}
                  </button>
                ))}
              </div>

              {/* Input Fields */}
              {inputFields.map((field) => (
                <div
                  key={field.name}
                >
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <field.icon size={16} className="text-primary" />
                    {field.label}
                  </label>
                  <Input
                    type={field.type || 'text'}
                    value={formData[field.name as keyof typeof formData] as string}
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    placeholder={field.placeholder}
                    required
                  />
                </div>
              ))}

              {/* Category */}
              <div
              >
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Tag size={16} className="text-primary" />
                  Category
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat })}
                      className={`py-2 px-3 rounded-lg text-sm transition-all duration-300 ${formData.category === cat
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div
              >
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <FileText size={16} className="text-primary" />
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the item in detail..."
                  className="w-full h-32 rounded-xl border border-border bg-input/50 px-4 py-3 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-all duration-300 backdrop-blur-sm resize-none"
                  required
                />
              </div>

              {/* Image Upload */}
              <div
              >
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Upload size={16} className="text-primary" />
                  Upload Image
                </label>
                <label className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer group block">
                  <Upload className="mx-auto mb-3 text-muted-foreground group-hover:text-primary transition-colors" size={32} />
                  <p className="text-muted-foreground">
                    {file ? file.name : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG up to 10MB
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0] || null;
                      setFile(f);
                    }}
                  />
                </label>
              </div>

              <div
              >
                <Button type="submit" variant="hero" size="xl" className="w-full">
                  Submit Report
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default Report;