import React from 'react';
import { Script } from '../../types';
import { ScriptCard } from './ScriptCard';

interface ScriptGridProps {
  scripts: Script[];
  onEdit: (script: Script) => void;
  onDelete: (scriptId: number) => void;
}

export const ScriptGrid: React.FC<ScriptGridProps> = ({
  scripts,
  onEdit,
  onDelete
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {scripts.map(script => {
        return (
          <ScriptCard
            key={script.id}
            script={script}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        );
      })}
    </div>
  );
};
