import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { ComponentSchema, RegistryItem, StyleProps } from '../types';

interface BuilderStore {
  canvas: ComponentSchema[];
  selected: string | null;

  addComponent: (item: RegistryItem, parentId?: string) => void;
  removeComponent: (id: string) => void;
  selectComponent: (id: string | null) => void;
  updateComponentProp: (id: string, key: string, value: string | number | boolean) => void;
  updateComponentStyle: (id: string, style: Partial<StyleProps>) => void;
  moveComponent: (activeId: string, overId: string) => void;
  saveProject: () => void;
  loadProject: () => void;
  clearCanvas: () => void;
  exportReactCode: () => string;
}

function findAndUpdate(
  components: ComponentSchema[],
  id: string,
  updater: (c: ComponentSchema) => ComponentSchema
): ComponentSchema[] {
  return components.map((c) => {
    if (c.id === id) return updater(c);
    if (c.children) return { ...c, children: findAndUpdate(c.children, id, updater) };
    return c;
  });
}

function findAndRemove(components: ComponentSchema[], id: string): ComponentSchema[] {
  return components
    .filter((c) => c.id !== id)
    .map((c) =>
      c.children ? { ...c, children: findAndRemove(c.children, id) } : c
    );
}

export const useBuilderStore = create<BuilderStore>((set, get) => ({
  canvas: [],
  selected: null,

  addComponent: (item, parentId) => {
    const newComponent: ComponentSchema = {
      id: uuidv4(),
      type: item.type,
      label: item.label,
      props: { ...item.defaultProps },
      style: { ...item.defaultStyle },
      children: item.type === 'container' ? [] : undefined,
    };

    set((state) => {
      if (parentId) {
        return {
          canvas: findAndUpdate(state.canvas, parentId, (parent) => ({
            ...parent,
            children: [...(parent.children ?? []), newComponent],
          })),
        };
      }
      return { canvas: [...state.canvas, newComponent] };
    });
  },

  removeComponent: (id) => {
    set((state) => ({
      canvas: findAndRemove(state.canvas, id),
      selected: state.selected === id ? null : state.selected,
    }));
  },

  selectComponent: (id) => {
    set({ selected: id });
  },

  updateComponentProp: (id, key, value) => {
    set((state) => ({
      canvas: findAndUpdate(state.canvas, id, (c) => ({
        ...c,
        props: { ...c.props, [key]: value },
      })),
    }));
  },

  updateComponentStyle: (id, style) => {
    set((state) => ({
      canvas: findAndUpdate(state.canvas, id, (c) => ({
        ...c,
        style: { ...c.style, ...style },
      })),
    }));
  },

  moveComponent: (activeId, overId) => {
    set((state) => {
      const canvas = [...state.canvas];
      const activeIndex = canvas.findIndex((c) => c.id === activeId);
      const overIndex = canvas.findIndex((c) => c.id === overId);
      if (activeIndex === -1 || overIndex === -1) return state;
      const [moved] = canvas.splice(activeIndex, 1);
      canvas.splice(overIndex, 0, moved);
      return { canvas };
    });
  },

  saveProject: () => {
    const { canvas } = get();
    const json = JSON.stringify({ canvas }, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fe-builder-project.json';
    a.click();
    URL.revokeObjectURL(url);
  },

  loadProject: () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          if (data.canvas) {
            set({ canvas: data.canvas, selected: null });
          }
        } catch {
          alert('Invalid project file.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  },

  clearCanvas: () => {
    set({ canvas: [], selected: null });
  },

  exportReactCode: () => {
    const { canvas } = get();

    function renderCode(components: ComponentSchema[], indent = 2): string {
      const pad = ' '.repeat(indent);
      return components
        .map((c) => {
          const styleStr = Object.entries(c.style)
            .map(([k, v]) => `${k}: '${v}'`)
            .join(', ');
          const inlineStyle = `{{ ${styleStr} }}`;

          switch (c.type) {
            case 'button':
              return `${pad}<button style={${inlineStyle}}>${c.props.text}</button>`;
            case 'text':
              return `${pad}<p style={${inlineStyle}}>${c.props.text}</p>`;
            case 'heading': {
              const Tag = (c.props.level as string) || 'h1';
              return `${pad}<${Tag} style={${inlineStyle}}>${c.props.text}</${Tag}>`;
            }
            case 'image':
              return `${pad}<img src="${c.props.src}" alt="${c.props.alt}" style={${inlineStyle}} />`;
            case 'divider':
              return `${pad}<hr style={${inlineStyle}} />`;
            case 'badge':
              return `${pad}<span style={${inlineStyle}}>${c.props.text}</span>`;
            case 'alert':
              return `${pad}<div style={${inlineStyle}}>${c.props.message}</div>`;
            case 'input':
              return `${pad}<div>\n${pad}  <label>${c.props.label}</label>\n${pad}  <input type="${c.props.type}" placeholder="${c.props.placeholder}" style={${inlineStyle}} />\n${pad}</div>`;
            case 'card':
              return `${pad}<div style={${inlineStyle}}>\n${pad}  <h3>${c.props.title}</h3>\n${pad}  <p>${c.props.body}</p>\n${pad}</div>`;
            case 'container':
              return `${pad}<div style={${inlineStyle}}>\n${renderCode(c.children ?? [], indent + 2)}\n${pad}</div>`;
            default:
              return `${pad}<div style={${inlineStyle}}></div>`;
          }
        })
        .join('\n');
    }

    return `import React from 'react';

function App() {
  return (
    <div>
${renderCode(canvas)}
    </div>
  );
}

export default App;
`;
  },
}));
