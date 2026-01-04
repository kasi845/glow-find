
export const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-1 px-4 py-3 rounded-2xl bg-muted w-fit rounded-bl-md">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
};
