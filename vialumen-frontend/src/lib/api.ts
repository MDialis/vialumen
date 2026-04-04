import { HierarchyGraphResponse, HierarchyLevel } from "@/types";

export async function getHierarchyLevels(): Promise<HierarchyLevel[] | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/hierarchy`);

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

export async function getHierarchyGraph(hierarchyId: string): Promise<HierarchyGraphResponse | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/hierarchies/${hierarchyId}/subthemes/connections`);

    if (!response.ok) {
      console.error(
        `Failed to fetch graph for ${hierarchyId}: ${response.status} ${response.statusText}`,
      );
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`Network error when fetching graph for ${hierarchyId}:`, error);
    return null;
  }
}