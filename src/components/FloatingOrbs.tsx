export const FloatingOrbs = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Primary Orb - Orange */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-20 blur-[120px] animate-blob"
        style={{
          background: 'radial-gradient(circle, hsl(25 95% 60%) 0%, transparent 70%)',
          top: '10%',
          left: '10%',
          animationDelay: '0s'
        }}
      />

      {/* Secondary Orb - Pink */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-15 blur-[100px] animate-blob"
        style={{
          background: 'radial-gradient(circle, hsl(320 80% 55%) 0%, transparent 70%)',
          top: '50%',
          right: '15%',
          animationDelay: '2s'
        }}
      />

      {/* Accent Orb - Purple */}
      <div
        className="absolute w-[350px] h-[350px] rounded-full opacity-15 blur-[80px] animate-blob"
        style={{
          background: 'radial-gradient(circle, hsl(280 70% 50%) 0%, transparent 70%)',
          bottom: '20%',
          left: '30%',
          animationDelay: '4s'
        }}
      />
    </div>
  );
};
