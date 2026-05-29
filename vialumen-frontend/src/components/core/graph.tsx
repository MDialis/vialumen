"use client";

import { useRouter } from "next/navigation";
import { HierarchyGraphResponse } from "@/types";
import { useForceGraph } from "@/hooks/use-force-graph";
import { GraphLink } from "./graph-link";
import { GraphNode } from "./graph-node";

interface GraphProps {
  data: HierarchyGraphResponse;
  hierarchyId: string;
}

export default function Graph({ data, hierarchyId }: GraphProps) {
  const router = useRouter();
  const {
    containerRef,
    svgRef,
    transform,
    dimensions,
    nodes,
    links,
    dragHandlers,
  } = useForceGraph(data);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[60vh] bg-background/50 rounded-2xl relative overflow-hidden"
    >
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        onPointerMove={dragHandlers.onPointerMove}
        className="w-full h-full touch-none cursor-grab active:cursor-grabbing"
      >
        {/* Master wrapper group that handles the visual zoom/pan effect */}
        <g transform={transform.toString()}>
          {/* Draw the connecting lines */}
          {links.map((link, i) => (
            <GraphLink key={`link-${i}`} link={link} />
          ))}

          {/* Draw the interactive circles */}
          {nodes.map((node) => (
            <GraphNode
              key={node.id}
              node={node}
              onClick={(slug) => router.push(`/path/${slug}?theme=${hierarchyId}`)}
              onPointerDown={dragHandlers.onPointerDown}
              onPointerUp={dragHandlers.onPointerUp}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}