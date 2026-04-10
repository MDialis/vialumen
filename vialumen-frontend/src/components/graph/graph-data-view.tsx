"use client";

import dynamic from "next/dynamic";
import useSWR from "swr";
import { getHierarchyGraph } from "@/lib/api";

const Graph = dynamic(
  () => import("@/components/graph/graph"),
  { ssr: false, loading: () => <GraphLoading /> }
);

export function GraphDataView({ hierarchyId }: { hierarchyId: string }) {
  // SWR handles the loading state, caching, and deduplication
  const { data: graphData, isLoading, error } = useSWR(
    hierarchyId ? `graph-${hierarchyId}` : null, 
    () => getHierarchyGraph(hierarchyId)
  );

  if (isLoading) return <GraphLoading />;

  if (error || !graphData) {
    return (
      <div className="p-10 text-destructive font-bold text-center">
        Failed to load graph data for {hierarchyId}.
      </div>
    );
  }

  if (graphData.nodes.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center p-10 text-muted-foreground italic">
        The path is currently empty. Add some subthemes to begin.
      </div>
    );
  }

  return <Graph data={graphData} hierarchyId={hierarchyId} />;
}

function GraphLoading() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-10">
      <span className="loading loading-spinner text-primary loading-lg"></span>
      <p className="mt-4 font-semibold text-muted-foreground animate-pulse">
        Illuminating pathways...
      </p>
    </div>
  );
}