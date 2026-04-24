export type ComponentType =
  | 'button'
  | 'text'
  | 'heading'
  | 'image'
  | 'card'
  | 'input'
  | 'divider'
  | 'container'
  | 'badge'
  | 'alert';

export interface StyleProps {
  color?: string;
  backgroundColor?: string;
  fontSize?: string;
  fontWeight?: string;
  padding?: string;
  margin?: string;
  borderRadius?: string;
  border?: string;
  width?: string;
  height?: string;
  textAlign?: 'left' | 'center' | 'right';
  display?: string;
  flexDirection?: 'row' | 'column';
  gap?: string;
  alignItems?: string;
  justifyContent?: string;
}

export interface ComponentSchema {
  id: string;
  type: ComponentType;
  label: string;
  props: Record<string, string | number | boolean>;
  style: StyleProps;
  children?: ComponentSchema[];
}

export interface RegistryItem {
  type: ComponentType;
  label: string;
  icon: string;
  defaultProps: Record<string, string | number | boolean>;
  defaultStyle: StyleProps;
  description: string;
}

export interface BuilderState {
  canvas: ComponentSchema[];
  selected: string | null;
}
