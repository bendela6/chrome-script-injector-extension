import React from 'react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNewScript: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, onSearchChange, onNewScript }) => {
  return (
    <div className="max-w-7xl mx-auto px-8 py-4 flex flex-col md:flex-row gap-4 items-stretch md:items-center mt-6">
      <div className="flex-1 relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">🔍</span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search scripts by name or URL pattern..."
          className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none transition-all"
        />
      </div>
      <button
        onClick={onNewScript}
        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:from-blue-700 hover:to-purple-700"
      >
        ➕ New Script
      </button>
    </div>
  );
};

