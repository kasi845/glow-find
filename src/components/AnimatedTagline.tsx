const words = [
  { text: 'Lose it.', className: 'text-foreground' },
  { text: 'Find it.', className: 'gradient-text' },
  { text: 'Claim it.', className: 'text-foreground' },
];

export const AnimatedTagline = () => {
  return (
    <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 max-w-4xl leading-tight">
      {words.map((word, i) => (
        <span
          key={i}
          className={`${word.className} inline-block animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-forwards`}
          style={{
            animationDelay: `${0.3 + i * 0.3}s`
          }}
        >
          {word.text}{' '}
        </span>
      ))}
    </h1>
  );
};
