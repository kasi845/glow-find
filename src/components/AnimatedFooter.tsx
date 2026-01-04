
export const AnimatedFooter = () => {
  return (
    <footer
      className="absolute bottom-0 left-0 right-0 z-10 p-6"
    >
      <div
        className="glass-card py-4 px-8 mx-auto w-fit"
      >
        <p className="text-sm text-muted-foreground text-center flex items-center gap-2 justify-center flex-wrap">
          <span>Made with</span>
          <span
            className="text-destructive"
          >
            ❤️
          </span>
          <span
            className="gradient-text font-bold text-lg"
          >
            ∞
          </span>
          <span className="gradient-text font-semibold tracking-wide">
            INFINITE LOOPERS
          </span>
          <span className="text-muted-foreground/60">|</span>
          <span>Hackathon 2025</span>
        </p>
      </div>

      {/* Emotional tagline */}
      <p
        className="text-center text-sm text-muted-foreground/70 mt-4 italic"
      >
        "Every item has a story. Every finder brings someone hope."
      </p>
    </footer>
  );
};
