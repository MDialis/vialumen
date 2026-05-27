import { useMemo } from "react";
import { HierarchyGraphResponse, SubthemeResponse } from "@/types";

export function useNodeLineage(
  graphData: HierarchyGraphResponse | null,
  currentSlug: string
) {
  return useMemo(() => {
    let parents: SubthemeResponse[] = [];
    let children: SubthemeResponse[] = [];
    let currentNode: SubthemeResponse | undefined;

    if (!graphData || !graphData.nodes || !graphData.edges) {
      return { parents, children, currentNode };
    }

    currentNode = graphData.nodes.find((n) => n.slug === currentSlug);

    if (currentNode) {
      // Traverse upwards to find ALL ancestors
      const visited = new Set<number>();
      let currentLevelIds = [currentNode.id];

      while (currentLevelIds.length > 0) {
        const nextLevelIds: number[] = [];

        for (const id of currentLevelIds) {
          const parentEdges = graphData.edges.filter((e) => e.target === id);

          for (const edge of parentEdges) {
            if (!visited.has(edge.source)) {
              visited.add(edge.source);
              nextLevelIds.push(edge.source);

              const parentNode = graphData.nodes.find((n) => n.id === edge.source);
              if (parentNode) {
                parents.push(parentNode);
              }
            }
          }
        }
        currentLevelIds = nextLevelIds;
      }

      // Reverse so the absolute root is at index 0 (top of the UI list)
      parents.reverse();

      // Find immediate children
      const childIds = graphData.edges
        .filter((e) => e.source === currentNode?.id)
        .map((e) => e.target);

      children = graphData.nodes.filter((n) => childIds.includes(n.id));
    }

    return { parents, children, currentNode };
  }, [graphData, currentSlug]); // Only re-run if graphData or currentSlug changes
}