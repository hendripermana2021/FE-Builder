import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ComponentSchema } from '../../types';
import { useBuilderStore } from '../../store/builderStore';
import ComponentRenderer from '../renderer/ComponentRenderer';

interface Props {
  component: ComponentSchema;
}

const CanvasElement: React.FC<Props> = ({ component }) => {
  const { selected, selectComponent, removeComponent } = useBuilderStore();
  const isSelected = selected === component.id;

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: component.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group rounded-md ${isSelected ? 'ring-2 ring-blue-500' : 'hover:ring-2 hover:ring-blue-200'}`}
      onClick={(e) => {
        e.stopPropagation();
        selectComponent(component.id);
      }}
    >
      {/* Drag handle + delete button */}
      <div
        className={`absolute -top-7 left-0 flex items-center gap-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-t-md z-10 ${isSelected ? 'flex' : 'hidden group-hover:flex'}`}
      >
        <span
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing mr-1"
          title="Drag to reorder"
        >
          ⠿
        </span>
        <span className="font-medium">{component.label}</span>
        <button
          className="ml-2 text-white hover:text-red-200 font-bold"
          onClick={(e) => {
            e.stopPropagation();
            removeComponent(component.id);
          }}
          title="Remove"
        >
          ✕
        </button>
      </div>

      {/* Rendered component */}
      <div className="pointer-events-none">
        <ComponentRenderer component={component} />
      </div>
    </div>
  );
};

export default CanvasElement;
