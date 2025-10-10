import React from "react";
import { Button } from "../../components";

interface EmptyStateProps {
  searchQuery: string;
  onNewScript: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ searchQuery, onNewScript }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-12 text-center">
      <div className="text-6xl mb-4">📝</div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">
        {searchQuery ? "No Scripts Found" : "No Scripts Yet"}
      </h2>
      <p className="text-slate-600 mb-6">
        {searchQuery
          ? `No scripts match "${searchQuery}"`
          : "Create your first script to get started with automatic injection"}
      </p>
      {!searchQuery && (
        <Button onClick={onNewScript} variant="primary">
          ➕ Create First Script
        </Button>
      )}
    </div>
  );
};
