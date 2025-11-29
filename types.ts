
export interface ContentSection {
  heading: string;
  body: string[]; // Array of paragraphs
}

export interface SectionContent {
  title: string;
  subtitle: string;
  intro: string; // High level summary
  sections: ContentSection[]; // Deep technical dive
  stats?: { label: string; value: string }[];
}

export interface NodeData {
  id: string;
  position: [number, number, number];
  color: string;
  icon: string; // Lucide icon name
  content: SectionContent;
  shape: 'box' | 'sphere' | 'octahedron' | 'torus' | 'icosahedron' | 'dodecahedron';
}

export type ActiveNodeState = NodeData | null;

export interface TourStep {
  targetNodeId: string;
  sectionIndex: number | 'intro'; // 'intro' for the top summary, number for specific section
  text: string; // The specific script for this chunk
  cameraOffset?: [number, number, number];
}
