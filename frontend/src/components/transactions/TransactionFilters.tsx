import {
  Search,
  ArrowUpDown,
  RotateCcw,
  Download,
} from "lucide-react";

interface TransactionFiltersProps {
  search: string;
  filter: string;
  category: string;
  sortBy: string;
  sortOrder: string;
  dateFilter: string;
  categories: string[];
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSortByChange: (value: string) => void;
  onSortOrderChange: (value: string) => void;
  onDateFilterChange: (value: string) => void;
  onClear: () => void;
  onExport: () => void;
}

export default function TransactionFilters({
  search,
  filter,
  category,
  sortBy,
  sortOrder,
  dateFilter,
  categories,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onSearchChange,
  onFilterChange,
  onCategoryChange,
  onSortByChange,
  onSortOrderChange,
  onDateFilterChange,
  onClear,
  onExport,
}: TransactionFiltersProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
      <div className="mb-6 flex items-center gap-3">
        <div>
          <h2 className="font-semibold text-white">
            Filter Transactions
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Search, filter, sort, or export your transactions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {/* Search */}
        <div className="relative xl:col-span-2">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            placeholder="Search by title or category..."
            value={search}
            onChange={(e) =>
              onSearchChange(e.target.value)
            }
            className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-11 pr-4 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
          />
        </div>

        {/* Type */}
        <select
          value={filter}
          onChange={(e) =>
            onFilterChange(e.target.value)
          }
          className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expenses</option>
        </select>

        {/* Category */}
        <select
          value={category}
          onChange={(e) =>
            onCategoryChange(e.target.value)
          }
          className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
        >
          <option value="all">All Categories</option>

          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        {/* Date Filter */}
        <select
          value={dateFilter}
          onChange={(e) =>
            onDateFilterChange(e.target.value)
          }
          className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
        >
          <option value="all">All Dates</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
        <input
          type="date"
          value={startDate}
          onChange={(e) =>
            onStartDateChange(e.target.value)
          }
          className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) =>
            onEndDateChange(e.target.value)
          }
          className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
        />

        {/* Sort By */}
        <div className="relative">
          <ArrowUpDown
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <select
            value={sortBy}
            onChange={(e) =>
              onSortByChange(e.target.value)
            }
            className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-800 py-3 pl-11 pr-4 text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
          >
            <option value="date">
              Sort by Date
            </option>
            <option value="amount">
              Sort by Amount
            </option>
            <option value="title">
              Sort by Title
            </option>
          </select>
        </div>

        {/* Sort Order */}
        <select
          value={sortOrder}
          onChange={(e) =>
            onSortOrderChange(e.target.value)
          }
          className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>

        {/* Clear */}
        <button
          type="button"
          onClick={onClear}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 font-medium text-slate-300 transition hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-400"
        >
          <RotateCcw size={18} />
          Clear Filters
        </button>

        {/* Export */}
        <button
          type="button"
          onClick={onExport}
          className="flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-3 font-semibold text-white shadow-lg shadow-cyan-500/10 transition hover:bg-cyan-500"
        >
          <Download size={18} />
          Export CSV
        </button>
      </div>
    </div>
  );
}