import { motion } from 'framer-motion';
import { useState } from 'react';
import { Search } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { ItemCard } from '@/components/ItemCard';
import { ClaimModal } from '@/components/ClaimModal';
import { Input } from '@/components/ui/input';
import { useApp, Item } from '@/contexts/AppContext';

const FoundItems = () => {
  const { items } = useApp();
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const foundItems = items.filter(i => 
    i.type === 'found' && 
    (i.title.toLowerCase().includes(search.toLowerCase()) ||
     i.location.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Found Items</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-6">
              Browse through items that people have found. Is one of them yours?
            </p>

            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search found items..."
                className="pl-12"
              />
            </div>
          </motion.div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {foundItems.map((item, index) => (
              <ItemCard
                key={item.id}
                item={item}
                index={index}
                onClaim={() => setSelectedItem(item)}
              />
            ))}
          </div>

          {foundItems.length === 0 && (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-muted-foreground text-lg">No found items yet</p>
            </motion.div>
          )}
        </div>
      </main>

      <ClaimModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
};

export default FoundItems;