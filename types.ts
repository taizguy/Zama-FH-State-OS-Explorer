export interface SectionContent {
  title: string;
  subtitle: string;
  body: string[];
  stats?: { label: string; value: string }[];
}

export interface NodeData {
  id: string;
  position: [number, number, number];
  color: string;
  icon: string; // Lucide icon name
  content: SectionContent;
  shape: 'box' | 'sphere' | 'octahedron' | 'torus';
}

export type ActiveNodeState = NodeData | null;