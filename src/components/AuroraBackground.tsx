
export const AuroraBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-background" />
      {/* Fallback Static Gradient */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'linear-gradient(45deg, hsl(25 95% 60% / 0.15), transparent 50%, hsl(320 80% 55% / 0.15))',
        }}
      />
    </div>
  );
};
