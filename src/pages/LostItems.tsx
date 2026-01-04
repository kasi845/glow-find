import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { FloatingIcons } from '@/components/FloatingIcons';
import { PageTransition } from '@/components/PageTransition';
import { ItemCard } from '@/components/ItemCard';
import { FoundReportModal } from '@/components/FoundReportModal';
import { Input } from '@/components/ui/input';
import { useApp, Item } from '@/contexts/AppContext';

const LostItems = () => {
  const { items, searchItems, user } = useApp();
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      searchItems('lost', search || undefined);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]); // Only depend on search, not searchItems

  // Get items user reported as FOUND (to show at top of LOST items page)
  const userFoundItems = items.filter(i => i.type === 'found' && i.userName === user?.name);
  const userFoundItemTitles = userFoundItems.map(i => i.title.toLowerCase());

  // Filter and sort lost items
  // Priority: Items matching user's found reports first, then user's own items at bottom, then others
  const lostItems = items
    .filter(i => i.type === 'lost')
    .sort((a, b) => {
      const aIsUserItem = a.userName === user?.name;
      const bIsUserItem = b.userName === user?.name;
      const aMatchesUserFound = userFoundItemTitles.some(title =>
        a.title.toLowerCase().includes(title) || title.includes(a.title.toLowerCase())
      );
      const bMatchesUserFound = userFoundItemTitles.some(title =>
        b.title.toLowerCase().includes(title) || title.includes(b.title.toLowerCase())
      );

      // Priority 1: Items matching user's found reports (show at top)
      if (aMatchesUserFound && !bMatchesUserFound) return -1;
      if (!aMatchesUserFound && bMatchesUserFound) return 1;

      // Priority 2: User's own items go to bottom (they can't claim their own)
      if (aIsUserItem && !bIsUserItem) return 1;
      if (!aIsUserItem && bIsUserItem) return -1;

      // Priority 3: Among others, show newest first
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <FloatingIcons />
        <Navbar />

        <main className="pt-24 pb-12 px-6">
          <div className="container mx-auto max-w-6xl">
            {/* Header */}
            <div
              className="mb-8"
            >
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
                <span className="gradient-text">Lost Items</span>
              </h1>
              <p className="text-muted-foreground text-lg mb-6">
                Help reunite people with their lost belongings
              </p>

              {/* Search */}
              <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search lost items..."
                  className="pl-12"
                />
              </div>
            </div>

            {/* Items Grid */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
              {lostItems.map((item, index) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  index={index}
                  onClaim={() => setSelectedItem(item)}
                  buttonText="I Found This"
                  buttonIcon="found"
                  currentUserName={user?.name}
                />
              ))}
            </div>

            {lostItems.length === 0 && (
              <div
                className="text-center py-20"
              >
                <p className="text-muted-foreground text-lg">No lost items found</p>
              </div>
            )}
          </div>
        </main>

        <FoundReportModal
          item={selectedItem}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      </div>
    </PageTransition>
  );
};

export default LostItems;