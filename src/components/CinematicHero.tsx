
export const CinematicHero = () => {
  return (
    <div
      className="flex flex-col items-center justify-center text-center space-y-6 px-6"
    >
      {/* Main Headline */}
      <h1
        className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-tight max-w-5xl"
      >
        <span
          className="inline-block"
        >
          Where what's lost
        </span>
        <br />
        <span
          className="inline-block gradient-text"
          style={{
            textShadow: '0 0 30px hsl(320 80% 55% / 0.5), 0 0 60px hsl(25 95% 60% / 0.3)',
          }}
        >
          finds its way home.
        </span>
      </h1>

      {/* Subtitle */}
      <p
        className="text-lg md:text-xl text-muted-foreground max-w-xl"
      >
        Reuniting people with their belongings — powered by AI, trust, and care.
      </p>

      {/* Decorative line */}
      <div
        className="w-24 h-1 rounded-full gradient-bg"
      />
    </div>
  );
};
