import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Bell } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { FloatingIcons } from '@/components/FloatingIcons';
import { PageTransition } from '@/components/PageTransition';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { toast } from '@/hooks/use-toast';

const Notifications = () => {
  const { claimRequests, acceptClaim, rejectClaim, items } = useApp();
  const pendingClaims = claimRequests.filter(c => c.status === 'pending');

  const handleAccept = (claimId: string, claimerName: string) => {
    acceptClaim(claimId);
    toast({
      title: "Claim Accepted! 🎉",
      description: `You can now chat with ${claimerName} in Messages.`,
    });
  };

  const handleReject = (claimId: string) => {
    rejectClaim(claimId);
    toast({
      title: "Claim Rejected",
      description: "The claimer has been notified.",
    });
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
              {pendingClaims.length > 0 ? (
                <>
                  <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
                      <span className="gradient-text">Notifications</span>
                    </h1>
                    <p className="text-muted-foreground text-lg">
                      Manage claim requests for your items
                    </p>
                  </motion.div>

                  <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                      {pendingClaims.map((claim, i) => (
                        <motion.div
                          key={claim.id}
                          className="glass-card p-6 overflow-hidden"
                          initial={{ opacity: 0, y: 50, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, x: -100, scale: 0.9 }}
                          transition={{ 
                            delay: i * 0.1,
                            type: 'spring',
                            stiffness: 300,
                            damping: 25
                          }}
                          layout
                        >
                          <div className="flex flex-col sm:flex-row items-start gap-4">
                            {/* Item Image */}
                            <motion.div 
                              className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0"
                              whileHover={{ scale: 1.05 }}
                            >
                              <img 
                                src={getItemImage(claim.itemId)}
                                alt={claim.itemTitle}
                                className="w-full h-full object-cover"
                              />
                            </motion.div>
                            
                            <div className="flex-1 w-full">
                              <div className="flex items-start gap-3 mb-2">
                                <motion.div 
                                  className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0"
                                  animate={{ rotate: [0, -10, 10, 0] }}
                                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                                >
                                  <Bell className="text-primary" size={20} />
                                </motion.div>
                                <div>
                                  <h3 className="font-display font-semibold text-lg text-foreground">
                                    New Claim Request
                                  </h3>
                                  <p className="text-muted-foreground text-sm">
                                    <span className="text-foreground font-medium">{claim.claimerName}</span> wants to claim{' '}
                                    <span className="text-primary font-medium">{claim.itemTitle}</span>
                                  </p>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground mb-4 ml-0 sm:ml-13">
                                <p>📧 {claim.claimerEmail}</p>
                                <p>📞 {claim.claimerPhone}</p>
                              </div>

                              <div className="flex flex-wrap gap-3 ml-0 sm:ml-13">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <Button
                                    onClick={() => handleAccept(claim.id, claim.claimerName)}
                                    variant="gradient"
                                    className="flex items-center gap-2"
                                  >
                                    <Check size={18} />
                                    Accept
                                  </Button>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <Button
                                    onClick={() => handleReject(claim.id)}
                                    variant="outline"
                                    className="flex items-center gap-2"
                                  >
                                    <X size={18} />
                                    Ignore
                                  </Button>
                                </motion.div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
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
      </div>
    </PageTransition>
  );
};

export default Notifications;
