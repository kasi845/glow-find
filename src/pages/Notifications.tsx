import { Check, X, Bell, CheckCircle2 } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { FloatingIcons } from '@/components/FloatingIcons';
import { PageTransition } from '@/components/PageTransition';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';

const Notifications = () => {
  const { claimRequests, acceptClaim, rejectClaim, markClaimDone, items, user } = useApp();
  const [showRejectConfirm, setShowRejectConfirm] = useState<string | null>(null);

  // Show pending and accepted claims ONLY for items the current user reported
  const activeClaims = claimRequests.filter(c => {
    const item = items.find(i => i.id === c.itemId);
    // Only show if item belongs to current user and claim is pending or accepted
    return item && item.userName === user?.name && (c.status === 'pending' || c.status === 'accepted');
  });

  const handleAccept = async (claimId: string, claimerName: string) => {
    try {
      await acceptClaim(claimId);
      toast({
        title: "Claim Accepted! 🎉",
        description: `You can now chat with ${claimerName} in Messages.`,
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to accept claim",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (claimId: string) => {
    try {
      await rejectClaim(claimId);
      toast({
        title: "Claim Rejected",
        description: "The claimer has been notified.",
      });
      setShowRejectConfirm(null);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to reject claim",
        variant: "destructive",
      });
    }
  };

  const handleDone = async (claimId: string, itemTitle: string) => {
    try {
      await markClaimDone(claimId);
      toast({
        title: "Exchange Complete! ✅",
        description: `${itemTitle} has been marked as completed.`,
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to mark as done",
        variant: "destructive",
      });
    }
  };

  // Get item image for claim
  const getItemImage = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    return item?.image || '/placeholder.svg';
  };

  return (
    <PageTransition>
      <div className="min-h-screen w-full flex flex-col bg-background">
        <FloatingIcons />
        <Navbar />

        <main className="flex-1 pt-16">
          <div className="h-[calc(100vh-64px)] overflow-y-auto">
            <div className="container mx-auto max-w-3xl px-6 py-8">
              {activeClaims.length > 0 ? (
                <>
                  <div
                    className="mb-8"
                  >
                    <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
                      <span className="gradient-text">Notifications</span>
                    </h1>
                    <p className="text-muted-foreground text-lg">
                      Manage claim requests for your items
                    </p>
                  </div>

                  <div className="space-y-4">
                    {activeClaims.map((claim) => (
                      <div
                        key={claim.id}
                        className="glass-card p-6 overflow-hidden"
                      >
                        <div className="flex flex-col sm:flex-row items-start gap-4">
                          {/* Item Image */}
                          <div
                            className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 hover:scale-105 transition-transform"
                          >
                            <img
                              src={getItemImage(claim.itemId)}
                              alt={claim.itemTitle}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 w-full">
                            <div className="flex items-start gap-3 mb-2">
                              <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${claim.status === 'accepted'
                                  ? 'bg-green-500/20'
                                  : 'bg-primary/20'
                                  }`}
                              >
                                {claim.status === 'accepted' ? (
                                  <CheckCircle2 className="text-green-500" size={20} />
                                ) : (
                                  <Bell className="text-primary" size={20} />
                                )}
                              </div>
                              <div>
                                <h3 className="font-display font-semibold text-lg text-foreground">
                                  {claim.status === 'accepted' ? 'Claim Accepted' : 'New Claim Request'}
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                  <span className="text-foreground font-medium">{claim.claimerName}</span> wants to claim{' '}
                                  <span className="text-primary font-medium">{claim.itemTitle}</span>
                                </p>
                                {claim.status === 'accepted' && (
                                  <p className="text-green-600 dark:text-green-400 text-xs mt-1 font-medium">
                                    ✓ You accepted this claim. Mark as done when exchange is complete.
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground mb-4 ml-0 sm:ml-13">
                              <p>📧 {claim.claimerEmail}</p>
                              <p>📞 {claim.claimerPhone}</p>
                            </div>

                            <div className="flex flex-wrap gap-3 ml-0 sm:ml-13">
                              {claim.status === 'pending' ? (
                                <>
                                  <div className="hover:scale-105 transition-transform">
                                    <Button
                                      onClick={() => handleAccept(claim.id, claim.claimerName)}
                                      variant="gradient"
                                      className="flex items-center gap-2"
                                    >
                                      <Check size={18} />
                                      Accept
                                    </Button>
                                  </div>
                                  <div className="hover:scale-105 transition-transform">
                                    <Button
                                      onClick={() => setShowRejectConfirm(claim.id)}
                                      variant="outline"
                                      className="flex items-center gap-2"
                                    >
                                      <X size={18} />
                                      Ignore
                                    </Button>
                                  </div>
                                </>
                              ) : claim.status === 'accepted' ? (
                                <div className="hover:scale-105 transition-transform">
                                  <Button
                                    onClick={() => handleDone(claim.id, claim.itemTitle)}
                                    variant="gradient"
                                    className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                                  >
                                    <CheckCircle2 size={18} />
                                    Mark as Done
                                  </Button>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-[calc(100vh-64px-4rem)]">
                  <EmptyState
                    type="notifications"
                    title="No pending notifications"
                    description="When someone claims your item, you'll see it here"
                  />
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Reject Confirmation Popup */}
        {showRejectConfirm && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowRejectConfirm(null)}
            />

            <div
              className="relative glass-card p-6 w-full max-w-md scale-100"
            >
              <h3 className="font-display text-xl font-bold mb-2">Reject Claim?</h3>
              <p className="text-muted-foreground mb-6">
                Are you sure you want to reject this claim? The claimer will be notified.
              </p>

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowRejectConfirm(null)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleReject(showRejectConfirm)}
                  variant="destructive"
                  className="flex-1"
                >
                  Reject
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Notifications;
