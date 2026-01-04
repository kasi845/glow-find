
interface FilterTabsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const filters = ['All', 'Lost', 'Found', 'Claimed'];

export const FilterTabs = ({ activeFilter, onFilterChange }: FilterTabsProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 px-2">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform active:scale-95 hover:scale-105 ${activeFilter === filter
              ? 'text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
            }`}
        >
          {activeFilter === filter && (
            <div
              className="absolute inset-0 gradient-bg rounded-xl -z-10"
            />
          )}
          <span className="relative z-10">{filter}</span>
        </button>
      ))}
    </div>
  );
};
