import React from 'react';

export const PageHeader: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 shadow-lg">
      <h1 className="text-3xl font-bold mb-2">🚀 Script Injector - Manage Scripts</h1>
      <p className="text-lg opacity-90">Create and manage your JavaScript injection scripts with automatic URL matching</p>
    </div>
  );
};

