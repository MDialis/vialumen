export interface User {
  id: string;
  name: string;
  email: string;
  role: string
  badge: string[] | null;
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

export interface PublicProfileResponse {
  name: string;
  username: string;
  image: string | null;
  createdAt: string;
  role: string
  badge: string[] | null;
}

export interface SubthemeSimple {
  id: number;
  title: string;
  slug: string;
}

export interface UserSearchResult {
  id: string;
  username: string;
  name: string;
}

export interface ContributorRequest {
  user_id: string | null;
  external_name: string | null;
  role: string;
}

export interface SourceRequest {
  title: string;
  url: string | null;
  source_type: string;
}

export interface CreateOfficialVersionPayload {
  subtheme_id: number;
  content_type: string;
  content_text: string;
  is_active: boolean;
  contributors: ContributorRequest[];
  sources: SourceRequest[];
}

export interface CreateCommunityPostPayload {
  subtheme_id: number;
  title: string;
  content_text: string;
  contributors: ContributorRequest[]; // Can be an empty array []
  sources: SourceRequest[];           // Can be an empty array []
}

export interface FormContributor {
  type: "platform" | "external";
  user_id: string | null;
  external_name: string | null;
  displayName: string;
  role: string;

  // UI-only states for autocomplete rendering
  searchQuery: string;
  searchResults: UserSearchResult[];
  isSearching: boolean;
}

export interface CommunityPostFeedResponse {
  id: number;
  subtheme_id: number;
  subtheme_name: string;
  subtheme_slug: string;
  user_id: string;
  author_name: string;
  username: string;
  title: string;
  content_text: string;
  created_at: string;
  net_votes: number;
}