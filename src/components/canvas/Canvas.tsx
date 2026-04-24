import React from 'react';
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { useBuilderStore } from '../../store/builderStore';
import { componentRegistry } from '../../data/componentRegistry';
import CanvasElement from './CanvasElement';

const DropZone: React.FC = () => {
  const { setNodeRef, isOver } = useDroppable({ id: 'canvas-droppable' });
  const { canvas } = useBuilderStore();

  return (
    <div
      ref={setNodeRef}
      className={`min-h-full transition-colors duration-150 ${isOver ? 'bg-blue-50' : 'bg-transparent'}`}
    >
      {canvas.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400 select-none">
          <div className="text-5xl mb-3">🎨</div>
          <p className="text-lg font-medium">Drop components here</p>
          <p className="text-sm mt-1">Drag from the left panel to start building</p>
        </div>
      )}
      <SortableContext items={canvas.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-6 pt-4 pb-16">
          {canvas.map((component) => (
            <CanvasElement key={component.id} component={component} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

const Canvas: React.FC = () => {
  const { addComponent, moveComponent, selectComponent } = useBuilderStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    // Drop from component library to canvas
    const registryItem = componentRegistry.find((r) => r.type === activeId);
    if (registryItem) {
      addComponent(registryItem);
      return;
    }

    // Reorder on canvas
    if (activeId !== overId && overId !== 'canvas-droppable') {
      moveComponent(activeId, overId);
    }
  };

  const handleDragOver = (_event: DragOverEvent) => {
    // Reserved for future nested container support
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div
        className="flex-1 overflow-auto bg-gray-50 px-8"
        onClick={() => selectComponent(null)}
      >
        <div className="max-w-3xl mx-auto min-h-full relative pt-8">
          <DropZone />
        </div>
      </div>
    </DndContext>
  );
};

export default Canvas;
