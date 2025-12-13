import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Bell, Package } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { FloatingIcons } from '@/components/FloatingIcons';
import { PageTransition } from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { toast } from '@/hooks/use-toast';

const Notifications = () => {
  const { claimRequests, acceptClaim, rejectClaim } = useApp();
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

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <FloatingIcons />
        <Navbar />
      
      <main className="pt-24 pb-12 px-6">
        <div className="container mx-auto max-w-3xl">
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
                  className="glass-card p-6"
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -100, scale: 0.95 }}
                  transition={{ delay: i * 0.1 }}
                  layout
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Bell className="text-primary" size={24} />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-display font-semibold text-lg text-foreground mb-1">
                        New Claim Request
                      </h3>
                      <p className="text-muted-foreground mb-3">
                        <span className="text-foreground font-medium">{claim.claimerName}</span> wants to claim{' '}
                        <span className="text-primary font-medium">{claim.itemTitle}</span>
                      </p>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-4">
                        <p>Email: {claim.claimerEmail}</p>
                        <p>Phone: {claim.claimerPhone}</p>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleAccept(claim.id, claim.claimerName)}
                          variant="gradient"
                          className="flex items-center gap-2"
                        >
                          <Check size={18} />
                          Accept
                        </Button>
                        <Button
                          onClick={() => handleReject(claim.id)}
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <X size={18} />
                          Ignore
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {pendingClaims.length === 0 && (
              <motion.div
                className="text-center py-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Package className="mx-auto mb-4 text-muted-foreground" size={48} />
                <p className="text-muted-foreground text-lg">No pending notifications</p>
                <p className="text-muted-foreground text-sm mt-2">
                  When someone claims your item, you'll see it here
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </main>
      </div>
    </PageTransition>
  );
};

export default Notifications;