import {
  HierarchyGraphResponse,
  HierarchyLevel,
  OfficialPageResponse,
  VersionMetaResponse,
} from "@/types";

const API = process.env.NEXT_PUBLIC_API;

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
    const response = await fetch(
      `${API}/core/${hierarchyId}`,
    );

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

export async function getOfficialSubthemeBySlug(
  slug: string,
): Promise<OfficialPageResponse | null> {
  try {
    const response = await fetch(`${API}/path/${slug}`);

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
    const response = await fetch(
      `${API}/path/${slug}/${contentType}`,
    );

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

export async function getSpecificVersion(id: string): Promise<OfficialPageResponse | null> {
  try {
    const response = await fetch(
      `${API}/version/${id}`,
    );

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
