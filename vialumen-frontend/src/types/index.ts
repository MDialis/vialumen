export interface User {
  id: string;
  name: string;
  email: string;
}

export interface HierarchyLevel {
  id: string;
  title: string;
  theme: string;
  image: string;
  description: string;
  href: string;
}

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