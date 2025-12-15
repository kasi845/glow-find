import { motion } from 'framer-motion';

interface FilterTabsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const filters = ['All', 'Lost', 'Found', 'Claimed'];

export const FilterTabs = ({ activeFilter, onFilterChange }: FilterTabsProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 px-2">
      {filters.map((filter) => (
        <motion.button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            activeFilter === filter
              ? 'text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {activeFilter === filter && (
            <motion.div
              layoutId="activeFilter"
              className="absolute inset-0 gradient-bg rounded-xl"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
          <span className="relative z-10">{filter}</span>
        </motion.button>
      ))}
    </div>
  );
};
