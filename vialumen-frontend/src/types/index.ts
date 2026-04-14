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

export interface ContributorResponse {
  name: string;
  role: string;
}

export interface SourceResponse {
  title: string;
  url?: string;
}

export interface ContentBlockResponse {
  version_id: number;
  content_type: string;
  content_text: string;
  has_older_versions?: boolean;
  contributors?: ContributorResponse[];
  sources?: SourceResponse[];
}

export interface OfficialPageResponse {
  id: number;
  title: string;
  slug: string;
  description?: string;
  blocks: ContentBlockResponse[];
}

export interface VersionBlockResponse {
  version_id: number;
  content_type: string;
  content_text: string;
  has_older_versions: boolean;
  contributors?: ContributorResponse[];
  sources?: SourceResponse[];
}

export interface VersionMetaResponse {
  version_id: number;
  accepted_at: string;
  is_active: boolean;
}