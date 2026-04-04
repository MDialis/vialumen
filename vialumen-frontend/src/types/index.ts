export interface User {
  id: string;
  name: string;
  email: string;
}

export interface HierarchyLevel {
  id: string; // Added this! The backend sends it (e.g., "physiology")
  title: string;
  theme: string;
  image: string;
  description: string;
  href: string;
}

// NEW: Types for the Graph
export interface SubthemeResponse {
  id: number;
  title: string;
  slug: string;
  description: string;
  created_at: string; 
}

export interface Connection {
  source: number;
  target: number;
}

export interface HierarchyGraphResponse {
  nodes: SubthemeResponse[];
  edges: Connection[];
}