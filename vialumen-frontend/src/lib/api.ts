import {
  HierarchyGraphResponse,
  HierarchyLevel,
  OfficialPageResponse,
  VersionBlockResponse,
  VersionMetaResponse,
  PublicProfileResponse,
  SubthemeSimple,
  UserSearchResult,
  CreateOfficialVersionRequest,
  CreateCommunityPostRequest,
  CommunityPostFeedResponse,
  CreateCommentRequest,
  VoteRequest,
  PostCommentResponse,
  CommunityPostDetailResponse,
} from "@/types";

const API = process.env.NEXT_PUBLIC_API;

export interface GetCommunityPostsOptions {
  feed?: "home" | "trending";
  subtheme_id?: number;
  slug?: string;
  token?: string;
}

// =========================
// HIERARCHIES
// =========================
export async function getHierarchyLevels(): Promise<HierarchyLevel[] | null> {
  try {
    const response = await fetch(`${API}/hierarchies`);

    if (!response.ok) {
      console.error(
        `Failed to fetch hierarchy: ${response.status} ${response.statusText}`,
      );
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Network error when fetching hierarchy:", error);
    return null;
  }
}

export async function getHierarchyGraph(
  hierarchyId: string,
): Promise<HierarchyGraphResponse | null> {
  try {
    const response = await fetch(`${API}/core/${hierarchyId}`);

    if (!response.ok) {
      console.error(
        `Failed to fetch graph for ${hierarchyId}: ${response.status} ${response.statusText}`,
      );
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(
      `Network error when fetching graph for ${hierarchyId}:`,
      error,
    );
    return null;
  }
}

export async function getSubthemesByHierarchy(
  hierarchyId: string,
): Promise<SubthemeSimple[] | null> {
  try {
    const response = await fetch(`${API}/hierarchies/${hierarchyId}/subthemes`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error(
      `Network error when fetching subthemes for hierarchy ${hierarchyId}:`,
      error,
    );
    return null;
  }
}

// =========================
// SUBTHEMES & PATHS
// =========================
export async function getSubthemes(): Promise<SubthemeSimple[] | null> {
  try {
    const response = await fetch(`${API}/subthemes`, { cache: "no-store" });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch subthemes:", error);
    return null;
  }
}

export async function getSubthemePathNodes(
  slug: string,
  hierarchyId?: string
): Promise<HierarchyGraphResponse | null> {
  try {
    // Append the query param if it exists
    const url = hierarchyId 
      ? `${API}/path/${slug}?hierarchy_id=${hierarchyId}`
      : `${API}/path/${slug}`;

    const response = await fetch(url);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error(`Network error fetching path nodes for ${slug}:`, error);
    return null;
  }
}

export async function getOfficialSubthemeBySlug(
  slug: string,
): Promise<OfficialPageResponse | null> {
  try {
    const response = await fetch(`${API}/path/${slug}/content`);
    if (!response.ok) {
      console.error(
        `Failed to fetch subtheme for slug ${slug}: ${response.status} ${response.statusText}`,
      );
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(
      `Network error when fetching subtheme for slug ${slug}:`,
      error,
    );
    return null;
  }
}

export async function getOfficialSubthemeVersionList(
  slug: string,
  contentType: string,
): Promise<VersionMetaResponse[] | null> {
  try {
    const response = await fetch(`${API}/path/${slug}/${contentType}`);

    if (!response.ok) {
      console.error(
        `Failed to fetch version history for slug ${slug} and content type ${contentType}: ${response.status} ${response.statusText}`,
      );
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(
      `Network error when fetching version history for slug ${slug} and content type ${contentType}:`,
      error,
    );
    return null;
  }
}

export async function getSpecificVersion(
  id: number,
): Promise<VersionBlockResponse | null> {
  try {
    const response = await fetch(`${API}/version/${id}`);

    if (!response.ok) {
      console.error(
        `Failed to fetch version with id ${id}: ${response.status} ${response.statusText}`,
      );
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`Network error when fetching version with id ${id}:`, error);
    return null;
  }
}

// =========================
// USERS & COMMUNITY
// =========================
export async function getUserProfile(
  username: string,
): Promise<PublicProfileResponse | null> {
  try {
    const response = await fetch(`${API}/profile/${username}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch profile for ${username}: ${response.status} ${response.statusText}`,
      );
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(
      `Network error when fetching profile for ${username}:`,
      error,
    );
    return null;
  }
}

export async function searchUsers(query: string): Promise<UserSearchResult[]> {
  if (!query.trim()) return [];
  try {
    const response = await fetch(
      `${API}/users/search?q=${encodeURIComponent(query)}`,
    );
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("User search failed:", error);
    return [];
  }
}

export async function getCommunityPosts(
  options?: GetCommunityPostsOptions,
): Promise<CommunityPostFeedResponse[] | null> {
  try {
    const params = new URLSearchParams();

    if (options?.feed) params.append("feed", options.feed);
    if (options?.subtheme_id)
      params.append("subtheme_id", options.subtheme_id.toString());
    if (options?.slug) params.append("slug", options.slug);

    const queryString = params.toString();
    const endpoint = queryString
      ? `${API}/community?${queryString}`
      : `${API}/community`;

    // Attach token if user is logged in (For the "home" feed)
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (options?.token) {
      headers["Authorization"] = `Bearer ${options.token}`;
    }

    // Fetch with no-store
    const response = await fetch(endpoint, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch community posts: ${response.status} ${response.statusText}`,
      );
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Network error fetching community posts:", error);
    return null;
  }
}

export async function getCommunityPostDetail(
  postId: string,
  token?: string
): Promise<CommunityPostDetailResponse | null> {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API}/community/${postId}`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`Failed to fetch post detail: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Network error fetching post details:", error);
    return null;
  }
}

// =========================
// POST ACTIONS
// =========================
export async function postOfficialContent(
  payload: CreateOfficialVersionRequest,
  token: string,
): Promise<boolean> {
  try {
    const response = await fetch(`${API}/admin/workspace/content/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(`Post failed: ${response.status} ${response.statusText}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Network error posting content:", error);
    return false;
  }
}

export async function postCommunityContent(
  payload: CreateCommunityPostRequest,
  token: string,
): Promise<boolean> {
  try {
    const response = await fetch(`${API}/community`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(
        `Community post failed: ${response.status} ${response.statusText}`,
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error("Network error posting community content:", error);
    return false;
  }
}

export async function castPostVote(
  postId: number,
  voteValue: 1 | -1 | 0,
  token: string
): Promise<boolean> {
  try {
    const payload: VoteRequest = { vote_value: voteValue };
    
    const response = await fetch(`${API}/community/${postId}/vote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(`Vote failed: ${response.status}`);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Network error posting vote:", error);
    return false;
  }
}

export async function postComment(postId: number, content: string, token: string): Promise<PostCommentResponse | null> {
  try {
    const payload: CreateCommentRequest = { content_text: content };
    const response = await fetch(`${API}/community/${postId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) return null;
    
    return await response.json(); 
  } catch (error) {
    console.error("Network error posting comment:", error);
    return null;
  }
}

export async function castCommentVote(commentId: number, voteValue: number, token: string): Promise<boolean> {
  try {
    const payload: VoteRequest = { vote_value: voteValue };
    const response = await fetch(`${API}/community/comments/${commentId}/vote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(`Comment vote failed: ${response.status}`);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Network error posting comment vote:", error);
    return false;
  }
}