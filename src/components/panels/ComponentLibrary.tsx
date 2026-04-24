import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { componentRegistry } from '../../data/componentRegistry';
import type { RegistryItem } from '../../types';
import { useBuilderStore } from '../../store/builderStore';

interface DraggableItemProps {
  item: RegistryItem;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ item }) => {
  const { addComponent } = useBuilderStore();
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: item.type,
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 cursor-grab active:cursor-grabbing hover:border-blue-400 hover:shadow-sm transition-all text-sm select-none ${isDragging ? 'opacity-50 shadow-md' : ''}`}
      title={item.description}
      onDoubleClick={() => addComponent(item)}
    >
      <span className="text-lg">{item.icon}</span>
      <div>
        <p className="font-medium text-gray-700">{item.label}</p>
      </div>
    </div>
  );
};

const ComponentLibrary: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = componentRegistry.filter(
    (item) =>
      item.label.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside className="w-56 flex-shrink-0 bg-gray-50 border-r border-gray-200 flex flex-col">
      <div className="p-3 border-b border-gray-200">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
          Components
        </h2>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-blue-400"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1.5">
        {filtered.map((item) => (
          <DraggableItem key={item.type} item={item} />
        ))}
        {filtered.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-4">No components found</p>
        )}
      </div>

      <div className="p-2 border-t border-gray-200">
        <p className="text-xs text-gray-400 text-center">
          Drag or double-click to add
        </p>
      </div>
    </aside>
  );
};

export default ComponentLibrary;
