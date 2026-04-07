import { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3-force";
import { HierarchyGraphResponse } from "@/types";

export interface GraphNode extends d3.SimulationNodeDatum {
  id: number;
  title: string;
  slug: string;
  description: string;
  created_at: string;
}

export interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: number | GraphNode;
  target: number | GraphNode;
}

export function useForceGraph(data: HierarchyGraphResponse) {
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(null);
  const draggedNodeRef = useRef<GraphNode | null>(null);

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [animatedNodes, setAnimatedNodes] = useState<GraphNode[]>([]);
  const [animatedLinks, setAnimatedLinks] = useState<GraphLink[]>([]);

  // --- Container Measurement ---
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(([entry]) => {
      setDimensions({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // --- D3 Physics Simulation ---
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    // Clone data so D3 doesn't mutate the original React props
    const nodes: GraphNode[] = data.nodes.map((n) => ({ ...n }));
    const links: GraphLink[] = data.edges.map((e) => ({ ...e }));

    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;

    const simulation = d3
      .forceSimulation<GraphNode, GraphLink>(nodes)
      .force("link", d3.forceLink<GraphNode, GraphLink>(links).id((d) => d.id).distance(150))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(centerX, centerY))
      .on("tick", () => {
        // Sync D3's internal state with React state on every frame
        setAnimatedNodes([...nodes]);
        setAnimatedLinks([...links]);
      });

    simulationRef.current = simulation;

    return () => {
      simulation.stop();
    };
  }, [data, dimensions]);

  // --- Drag Interactions ---
  const onPointerDown = useCallback((e: React.PointerEvent, node: GraphNode) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    draggedNodeRef.current = node;
    
    // "Pin" the node to its current position while dragging
    node.fx = node.x;
    node.fy = node.y;
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const container = containerRef.current;
    const draggedNode = draggedNodeRef.current;

    if (!draggedNode || !container) return;

    // Calculate new position relative to the container
    const bounds = container.getBoundingClientRect();
    draggedNode.fx = e.clientX - bounds.left;
    draggedNode.fy = e.clientY - bounds.top;

    // Briefly "reheat" the simulation to allow other nodes to react to the drag
    if (simulationRef.current) {
      simulationRef.current.alphaTarget(0.3).restart();
    }
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent, node: GraphNode) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    draggedNodeRef.current = null;
    
    // "Unpin" the node so physics can take over again
    node.fx = null;
    node.fy = null;

    // "Cool down" the simulation
    if (simulationRef.current) {
      simulationRef.current.alphaTarget(0);
    }
  }, []);

  // --- Return ---
  return {
    containerRef,
    dimensions,
    nodes: animatedNodes,
    links: animatedLinks,
    dragHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
    },
  };
}