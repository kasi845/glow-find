import { motion } from 'framer-motion';
import { Search, Package, Handshake, Shield, MessageCircle, CheckCircle } from 'lucide-react';

const aboutCards = [
  {
    icon: Search,
    title: "What is this platform?",
    description: "Lost & Found Tracker helps people report lost items and connect with those who find them — safely and transparently.",
    color: "text-pink-400",
    gradient: "from-pink-500/20 to-purple-500/20"
  },
  {
    icon: Package,
    title: "Lost an item?",
    description: "Report your lost item with details. Anyone who finds it can contact you securely through the platform.",
    color: "text-orange-400",
    gradient: "from-orange-500/20 to-red-500/20"
  },
  {
    icon: Handshake,
    title: "Found an item?",
    description: "Upload item details and help return it to the rightful owner. No personal contact is shared without approval.",
    color: "text-purple-400",
    gradient: "from-purple-500/20 to-violet-500/20"
  },
  {
    icon: Shield,
    title: "Safe & Trusted",
    description: "Claims require proof and descriptions. AI and moderation help reduce false claims and ensure trust.",
    color: "text-green-400",
    gradient: "from-green-500/20 to-emerald-500/20"
  },
  {
    icon: MessageCircle,
    title: "Secure Messaging",
    description: "Once a claim is accepted, chat securely within the platform to arrange item pickup without sharing personal details.",
    color: "text-cyan-400",
    gradient: "from-cyan-500/20 to-blue-500/20"
  },
  {
    icon: CheckCircle,
    title: "Verification System",
    description: "Build trust through our verification system. Verified users earn trust badges and higher visibility.",
    color: "text-yellow-400",
    gradient: "from-yellow-500/20 to-amber-500/20"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export const AboutSection = () => {
  return (
    <section
      id="about"
      className="relative z-10 py-20 px-6 max-w-6xl mx-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
          <span className="gradient-text">About Lost & Found Tracker</span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          A platform built on trust, transparency, and the mission to reunite people with their belongings.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {aboutCards.map((card, index) => (
          <motion.div
            key={card.title}
            variants={cardVariants}
            className="glass-card p-6 relative overflow-hidden group"
            whileHover={{ 
              scale: 1.02, 
              y: -5,
              transition: { duration: 0.2 }
            }}
          >
            {/* Background glow */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${card.gradient} opacity-50 blur-2xl group-hover:opacity-80 transition-opacity`} />
            
            <div className="relative z-10">
              <motion.div 
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4`}
                whileHover={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.4 }}
              >
                <card.icon className={card.color} size={24} />
              </motion.div>
              
              <h3 className={`text-xl font-semibold ${card.color} mb-3`}>
                {card.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {card.description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Emotional statement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-16 text-center"
      >
        <p className="text-xl md:text-2xl text-muted-foreground italic">
          "Every item has a story. Every finder brings someone hope."
        </p>
        <motion.span
          className="inline-block mt-4 text-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          ❤️
        </motion.span>
      </motion.div>
    </section>
  );
};
