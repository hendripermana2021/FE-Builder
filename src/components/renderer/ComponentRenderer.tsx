import React from 'react';
import type { ComponentSchema, StyleProps } from '../../types';

interface Props {
  component: ComponentSchema;
}

function toReactStyle(style: StyleProps): React.CSSProperties {
  return style as React.CSSProperties;
}

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

const ComponentRenderer: React.FC<Props> = ({ component }) => {
  const style = toReactStyle(component.style);
  const { props } = component;

  switch (component.type) {
    case 'button':
      return (
        <button style={style} disabled={props.disabled as boolean}>
          {props.text as string}
        </button>
      );

    case 'text':
      return <p style={style}>{props.text as string}</p>;

    case 'heading': {
      const level = ((props.level as string) || 'h1') as HeadingTag;
      const Tag = level;
      return <Tag style={style}>{props.text as string}</Tag>;
    }

    case 'image':
      return (
        <img
          src={props.src as string}
          alt={props.alt as string}
          style={{ ...style, objectFit: 'cover' }}
        />
      );

    case 'card':
      return (
        <div style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08)', ...style }}>
          <h3 style={{ fontWeight: 700, fontSize: '16px', marginBottom: '8px', color: '#111827' }}>
            {props.title as string}
          </h3>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>{props.body as string}</p>
        </div>
      );

    case 'input':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {props.label && (
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>
              {props.label as string}
            </label>
          )}
          <input
            type={(props.type as string) || 'text'}
            placeholder={props.placeholder as string}
            style={{ ...style, outline: 'none', boxSizing: 'border-box' }}
            readOnly
          />
        </div>
      );

    case 'divider':
      return <hr style={style} />;

    case 'badge':
      return <span style={style}>{props.text as string}</span>;

    case 'alert':
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', ...style }}>
          <span>ℹ️</span>
          <span>{props.message as string}</span>
        </div>
      );

    case 'container':
      return (
        <div style={style}>
          {(component.children ?? []).map((child) => (
            <ComponentRenderer key={child.id} component={child} />
          ))}
        </div>
      );

    default:
      return (
        <div style={{ padding: '8px', border: '1px dashed #ccc', color: '#888' }}>
          Unknown: {component.type}
        </div>
      );
  }
};

export default ComponentRenderer;
