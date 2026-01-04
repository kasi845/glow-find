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

export const AboutSection = () => {
  return (
    <section
      id="about"
      className="relative z-10 py-20 px-6 max-w-6xl mx-auto"
    >
      <div
        className="text-center mb-12"
      >
        <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
          <span className="gradient-text">About Lost & Found Tracker</span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          A platform built on trust, transparency, and the mission to reunite people with their belongings.
        </p>
      </div>

      <div
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {aboutCards.map((card) => (
          <div
            key={card.title}
            className="glass-card p-6 relative overflow-hidden group hover:scale-[1.02] hover:-translate-y-1 transition-all duration-200"
          >
            {/* Background glow */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${card.gradient} opacity-50 blur-2xl group-hover:opacity-80 transition-opacity`} />

            <div className="relative z-10">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4 transition-transform duration-500 group-hover:rotate-6`}
              >
                <card.icon className={card.color} size={24} />
              </div>

              <h3 className={`text-xl font-semibold ${card.color} mb-3`}>
                {card.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Emotional statement */}
      <div
        className="mt-16 text-center"
      >
        <p className="text-xl md:text-2xl text-muted-foreground italic">
          "Every item has a story. Every finder brings someone hope."
        </p>
        <span
          className="inline-block mt-4 text-3xl animate-pulse"
        >
          ❤️
        </span>
      </div>
    </section>
  );
};
