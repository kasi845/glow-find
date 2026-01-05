import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { FloatingIcons } from '@/components/FloatingIcons';
import { PageTransition } from '@/components/PageTransition';
import { ItemCard } from '@/components/ItemCard';
import { ClaimModal } from '@/components/ClaimModal';
import { ReportItemModal } from '@/components/ReportItemModal';
import { Input } from '@/components/ui/input';
import { useApp, Item } from '@/contexts/AppContext';

const FoundItems = () => {
  const { items, searchItems, user, claimRequests } = useApp();
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [reportItem, setReportItem] = useState<Item | null>(null);

  // Debounce search to avoid too many API calls
  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      searchItems(undefined, search || undefined);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]); // Only depend on search, not searchItems

  // Get items user reported as LOST (to show matching FOUND items at top)
  const userLostItems = items.filter(i => i.type === 'lost' && i.userName === user?.name);
  const userLostItemTitles = userLostItems.map(i => i.title.toLowerCase());

  // Filter and sort found items
  // Priority: Items matching user's lost reports first, then user's own items at bottom, then others
  const foundItems = items
    .filter(i => i.type === 'found' || i.status === 'completed')
    .sort((a, b) => {
      // Priority 0: Active items first, Completed items last
      const aIsCompleted = a.status === 'completed';
      const bIsCompleted = b.status === 'completed';
      if (aIsCompleted && !bIsCompleted) return 1;
      if (!aIsCompleted && bIsCompleted) return -1;

      // If both are completed, sort by date (newest first)
      if (aIsCompleted && bIsCompleted) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }

      const aIsUserItem = a.userName === user?.name;
      const bIsUserItem = b.userName === user?.name;
      const aMatchesUserLost = userLostItemTitles.some(title =>
        a.title.toLowerCase().includes(title) || title.includes(a.title.toLowerCase())
      );
      const bMatchesUserLost = userLostItemTitles.some(title =>
        b.title.toLowerCase().includes(title) || title.includes(b.title.toLowerCase())
      );

      // Priority 1: Items matching user's lost reports (show at top)
      if (aMatchesUserLost && !bMatchesUserLost) return -1;
      if (!aMatchesUserLost && bMatchesUserLost) return 1;

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
            </div>

            {/* Items Grid */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
              {foundItems.map((item, index) => {
                const myClaim = claimRequests.find(c => c.itemId === item.id && c.claimerEmail === user?.email);
                const isCompleted = item.status === 'completed';

                let buttonText = "Claim Item";
                let onClaim = () => setSelectedItem(item);

                if (isCompleted) {
                  buttonText = "Report Fake";
                  onClaim = () => setReportItem(item);
                } else if (myClaim) {
                  onClaim = () => { };
                  if (myClaim.status === 'pending') {
                    buttonText = "Claim Pending";
                  } else if (myClaim.status === 'accepted') {
                    buttonText = "Claim Accepted";
                  } else if (myClaim.status === 'rejected') {
                    buttonText = "Claim Rejected";
                  }
                }

                return (
                  <ItemCard
                    key={item.id}
                    item={item}
                    index={index}
                    onClaim={onClaim}
                    buttonText={buttonText}
                    currentUserName={user?.name}
                  />
                );
              })}
            </div>

            {foundItems.length === 0 && (
              <div
                className="text-center py-20"
              >
                <p className="text-muted-foreground text-lg">No found items yet</p>
              </div>
            )}
          </div>
        </main>

        <ClaimModal
          item={selectedItem}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
        />

        <ReportItemModal
          item={reportItem}
          isOpen={!!reportItem}
          onClose={() => setReportItem(null)}
        />
      </div>
    </PageTransition>
  );
};

export default FoundItems;