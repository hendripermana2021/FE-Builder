import React from 'react';
import { useBuilderStore } from '../../store/builderStore';
import type { ComponentSchema, StyleProps } from '../../types';

function findComponent(components: ComponentSchema[], id: string): ComponentSchema | null {
  for (const c of components) {
    if (c.id === id) return c;
    if (c.children) {
      const found = findComponent(c.children, id);
      if (found) return found;
    }
  }
  return null;
}

interface FieldProps {
  label: string;
  children: React.ReactNode;
}

const Field: React.FC<FieldProps> = ({ label, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
    {children}
  </div>
);

const inputClass =
  'w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 bg-white';

const PropertiesPanel: React.FC = () => {
  const { canvas, selected, updateComponentProp, updateComponentStyle, removeComponent } =
    useBuilderStore();

  if (!selected) {
    return (
      <aside className="w-60 flex-shrink-0 bg-gray-50 border-l border-gray-200 flex flex-col items-center justify-center p-6">
        <div className="text-4xl mb-3">🖱️</div>
        <p className="text-sm text-gray-500 text-center">
          Click a component on the canvas to edit its properties
        </p>
      </aside>
    );
  }

  const component = findComponent(canvas, selected);
  if (!component) return null;

  const updateProp = (key: string, value: string | number | boolean) =>
    updateComponentProp(selected, key, value);

  const updateStyle = (key: keyof StyleProps, value: string) =>
    updateComponentStyle(selected, { [key]: value });

  return (
    <aside className="w-60 flex-shrink-0 bg-gray-50 border-l border-gray-200 flex flex-col overflow-hidden">
      <div className="p-3 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Properties</h2>
          <p className="text-sm font-semibold text-gray-800 mt-0.5">{component.label}</p>
        </div>
        <button
          onClick={() => removeComponent(selected)}
          className="text-red-400 hover:text-red-600 text-lg"
          title="Delete component"
        >
          🗑️
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-4">
        {/* Content Props */}
        <section>
          <h3 className="text-xs font-bold text-blue-600 uppercase mb-2">Content</h3>
          <div className="flex flex-col gap-2">
            {component.type === 'button' && (
              <Field label="Button Text">
                <input
                  className={inputClass}
                  value={(component.props.text as string) || ''}
                  onChange={(e) => updateProp('text', e.target.value)}
                />
              </Field>
            )}

            {(component.type === 'text' || component.type === 'heading') && (
              <Field label="Text">
                <textarea
                  className={`${inputClass} resize-y min-h-[60px]`}
                  value={(component.props.text as string) || ''}
                  onChange={(e) => updateProp('text', e.target.value)}
                />
              </Field>
            )}

            {component.type === 'heading' && (
              <Field label="Level">
                <select
                  className={inputClass}
                  value={(component.props.level as string) || 'h1'}
                  onChange={(e) => updateProp('level', e.target.value)}
                >
                  <option value="h1">H1</option>
                  <option value="h2">H2</option>
                  <option value="h3">H3</option>
                </select>
              </Field>
            )}

            {component.type === 'image' && (
              <>
                <Field label="Image URL">
                  <input
                    className={inputClass}
                    value={(component.props.src as string) || ''}
                    onChange={(e) => updateProp('src', e.target.value)}
                  />
                </Field>
                <Field label="Alt Text">
                  <input
                    className={inputClass}
                    value={(component.props.alt as string) || ''}
                    onChange={(e) => updateProp('alt', e.target.value)}
                  />
                </Field>
              </>
            )}

            {component.type === 'card' && (
              <>
                <Field label="Title">
                  <input
                    className={inputClass}
                    value={(component.props.title as string) || ''}
                    onChange={(e) => updateProp('title', e.target.value)}
                  />
                </Field>
                <Field label="Body">
                  <textarea
                    className={`${inputClass} resize-y min-h-[60px]`}
                    value={(component.props.body as string) || ''}
                    onChange={(e) => updateProp('body', e.target.value)}
                  />
                </Field>
              </>
            )}

            {component.type === 'input' && (
              <>
                <Field label="Label">
                  <input
                    className={inputClass}
                    value={(component.props.label as string) || ''}
                    onChange={(e) => updateProp('label', e.target.value)}
                  />
                </Field>
                <Field label="Placeholder">
                  <input
                    className={inputClass}
                    value={(component.props.placeholder as string) || ''}
                    onChange={(e) => updateProp('placeholder', e.target.value)}
                  />
                </Field>
                <Field label="Input Type">
                  <select
                    className={inputClass}
                    value={(component.props.type as string) || 'text'}
                    onChange={(e) => updateProp('type', e.target.value)}
                  >
                    <option value="text">Text</option>
                    <option value="email">Email</option>
                    <option value="password">Password</option>
                    <option value="number">Number</option>
                  </select>
                </Field>
              </>
            )}

            {component.type === 'badge' && (
              <Field label="Text">
                <input
                  className={inputClass}
                  value={(component.props.text as string) || ''}
                  onChange={(e) => updateProp('text', e.target.value)}
                />
              </Field>
            )}

            {component.type === 'alert' && (
              <Field label="Message">
                <textarea
                  className={`${inputClass} resize-y min-h-[60px]`}
                  value={(component.props.message as string) || ''}
                  onChange={(e) => updateProp('message', e.target.value)}
                />
              </Field>
            )}

            {component.type === 'container' && (
              <Field label="Direction">
                <select
                  className={inputClass}
                  value={(component.props.direction as string) || 'row'}
                  onChange={(e) => {
                    updateProp('direction', e.target.value);
                    updateStyle('flexDirection', e.target.value as 'row' | 'column');
                  }}
                >
                  <option value="row">Row</option>
                  <option value="column">Column</option>
                </select>
              </Field>
            )}
          </div>
        </section>

        {/* Style Props */}
        <section>
          <h3 className="text-xs font-bold text-purple-600 uppercase mb-2">Style</h3>
          <div className="flex flex-col gap-2">
            <Field label="Text Color">
              <div className="flex gap-1.5 items-center">
                <input
                  type="color"
                  className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                  value={component.style.color || '#000000'}
                  onChange={(e) => updateStyle('color', e.target.value)}
                />
                <input
                  className={`${inputClass} flex-1`}
                  value={component.style.color || ''}
                  onChange={(e) => updateStyle('color', e.target.value)}
                />
              </div>
            </Field>

            <Field label="Background">
              <div className="flex gap-1.5 items-center">
                <input
                  type="color"
                  className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                  value={component.style.backgroundColor || '#ffffff'}
                  onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                />
                <input
                  className={`${inputClass} flex-1`}
                  value={component.style.backgroundColor || ''}
                  onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                />
              </div>
            </Field>

            <Field label="Font Size">
              <input
                className={inputClass}
                value={component.style.fontSize || ''}
                placeholder="e.g. 14px"
                onChange={(e) => updateStyle('fontSize', e.target.value)}
              />
            </Field>

            <Field label="Font Weight">
              <select
                className={inputClass}
                value={component.style.fontWeight || ''}
                onChange={(e) => updateStyle('fontWeight', e.target.value)}
              >
                <option value="">Default</option>
                <option value="400">Regular (400)</option>
                <option value="500">Medium (500)</option>
                <option value="600">SemiBold (600)</option>
                <option value="700">Bold (700)</option>
              </select>
            </Field>

            <Field label="Padding">
              <input
                className={inputClass}
                value={component.style.padding || ''}
                placeholder="e.g. 8px 16px"
                onChange={(e) => updateStyle('padding', e.target.value)}
              />
            </Field>

            <Field label="Border Radius">
              <input
                className={inputClass}
                value={component.style.borderRadius || ''}
                placeholder="e.g. 8px"
                onChange={(e) => updateStyle('borderRadius', e.target.value)}
              />
            </Field>

            <Field label="Width">
              <input
                className={inputClass}
                value={component.style.width || ''}
                placeholder="e.g. 100% or 200px"
                onChange={(e) => updateStyle('width', e.target.value)}
              />
            </Field>

            <Field label="Text Align">
              <div className="flex gap-1">
                {(['left', 'center', 'right'] as const).map((align) => (
                  <button
                    key={align}
                    className={`flex-1 py-1 text-xs rounded border ${component.style.textAlign === align ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-600 border-gray-300 hover:border-blue-300'}`}
                    onClick={() => updateStyle('textAlign', align)}
                  >
                    {align === 'left' ? '⬅' : align === 'center' ? '↔' : '➡'}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        </section>
      </div>
    </aside>
  );
};

export default PropertiesPanel;
