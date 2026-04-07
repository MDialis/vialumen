"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3-force";
import { useRouter } from "next/navigation";
import { HierarchyGraphResponse } from "@/types";

interface GraphNode extends d3.SimulationNodeDatum {
  id: number;
  title: string;
  slug: string;
  description: string;
  created_at: string;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: number | GraphNode;
  target: number | GraphNode;
}

interface GraphProps {
  data: HierarchyGraphResponse;
  hierarchyId: string;
}

export default function Graph({ data, hierarchyId }: GraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const simulationRef = useRef<d3.Simulation<any, any> | null>(null);
  const draggedNodeRef = useRef<any>(null);

  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  const [animatedNodes, setAnimatedNodes] = useState<any[]>([]);
  const [animatedLinks, setAnimatedLinks] = useState<any[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (dimensions.width === 0) return;

    const nodes: GraphNode[] = data.nodes.map((n) => ({ ...n }));
    const links: GraphLink[] = data.edges.map((e) => ({ ...e }));

    const simulation = d3
      .forceSimulation<GraphNode, GraphLink>(nodes)
      .force(
        "link",
        d3
          .forceLink<GraphNode, GraphLink>(links)
          .id((d) => d.id)
          .distance(150),
      )
      .force("charge", d3.forceManyBody().strength(-400))
      .force(
        "center",
        d3.forceCenter(dimensions.width / 2, dimensions.height / 2),
      )
      .on("tick", () => {
        setAnimatedNodes([...nodes]);
        setAnimatedLinks([...links]);
      });

    simulationRef.current = simulation;

    return () => {
      simulation.stop();
    };
  }, [data, dimensions]);

  const handlePointerDown = (e: React.PointerEvent, node: any) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    draggedNodeRef.current = node;

    node.fx = node.x;
    node.fy = node.y;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggedNodeRef.current || !containerRef.current) return;

    const bounds = containerRef.current.getBoundingClientRect();
    const node = draggedNodeRef.current;

    node.fx = e.clientX - bounds.left;
    node.fy = e.clientY - bounds.top;

    if (simulationRef.current) {
      simulationRef.current.alphaTarget(0.3).restart();
    }
  };

  const handlePointerUp = (e: React.PointerEvent, node: any) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    draggedNodeRef.current = null;

    node.fx = null;
    node.fy = null;

    if (simulationRef.current) {
      simulationRef.current.alphaTarget(0);
    }
  };

  const handleNodeClick = (slug: string) => {
    router.push(`/${slug}`);
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[60vh] bg-background/50 rounded-2xl relative overflow-hidden"
    >
      <svg
        width={dimensions.width}
        height={dimensions.height}
        onPointerMove={handlePointerMove}
        className="w-full h-full touch-none"
      >
        {animatedLinks.map((link, i) => (
          <line
            key={`link-${i}`}
            x1={link.source.x}
            y1={link.source.y}
            x2={link.target.x}
            y2={link.target.y}
            stroke="var(--muted-foreground)"
            strokeWidth={2}
            opacity={0.6}
          />
        ))}

        {/* Draw Nodes */}
        {animatedNodes.map((node) => (
          <g
            key={node.id}
            transform={`translate(${node.x || 0}, ${node.y || 0})`}
            style={{ cursor: "pointer" }}
            onClick={() => handleNodeClick(node.slug)}
            onPointerDown={(e) => handlePointerDown(e, node)}
            onPointerUp={(e) => handlePointerUp(e, node)}
            className="group"
          >
            <title>{node.description || node.title}</title>

            <circle
              r={16}
              fill="var(--primary)"
              className="transition-all duration-200 group-hover:scale-110 group-hover:fill-yellow-400"
            />

            <text
              y={28}
              textAnchor="middle"
              fill="var(--foreground)"
              className="text-xs font-medium pointer-events-none select-none transition-all duration-200 group-hover:font-bold"
            >
              {node.title}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
