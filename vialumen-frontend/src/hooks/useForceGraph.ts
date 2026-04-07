import { useEffect, useRef, useState, useCallback } from "react";
import { HierarchyGraphResponse } from "@/types";
import * as d3 from "d3-force";
import * as d3Zoom from "d3-zoom";
import * as d3Selection from "d3-selection";

export interface GraphNode extends d3.SimulationNodeDatum {
  id: number;
  title: string;
  slug: string;
  description: string;
  created_at: string;
  depth?: number;
  radius?: number;
}

export interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: number | GraphNode;
  target: number | GraphNode;
}

export function useForceGraph(data: HierarchyGraphResponse) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(null);
  const draggedNodeRef = useRef<GraphNode | null>(null);

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [animatedNodes, setAnimatedNodes] = useState<GraphNode[]>([]);
  const [animatedLinks, setAnimatedLinks] = useState<GraphLink[]>([]);

  const [transform, setTransform] = useState<d3Zoom.ZoomTransform>(d3Zoom.zoomIdentity);
  const transformRef = useRef(d3Zoom.zoomIdentity);

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

    const links: GraphLink[] = data.edges.map((e) => ({ ...e }));

    // Identify in-degrees (how many edges point TO a node)
    const inDegree = new Map<number, number>();
    const adjList = new Map<number, number[]>();

    data.nodes.forEach(n => {
      inDegree.set(n.id, 0);
      adjList.set(n.id, []);
    });

    data.edges.forEach(edge => {
      inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
      adjList.get(edge.source)?.push(edge.target);
    });

    // Initialize nodes with default values
    const nodesMap = new Map<number, GraphNode>();
    const nodes: GraphNode[] = data.nodes.map((n) => {
      const node = { ...n, depth: 0, radius: 12 };
      nodesMap.set(n.id, node);
      return node;
    });

    // Calculate Depth using Breadth-First Search (Queue)
    // Find all nodes with 0 incoming edges (the roots)
    const queue = data.nodes.filter(n => inDegree.get(n.id) === 0).map(n => n.id);
    const visited = new Set<number>();

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      if (!visited.has(currentId)) {
        visited.add(currentId);

        const currentNode = nodesMap.get(currentId)!;

        // Calculate dynamic radius based on depth
        currentNode.radius = Math.max(8, 32 - (currentNode.depth! * 8));  // e.g., Depth 0 = 32px, Depth 1 = 24px, Depth 2 = 16px, minimum 8px

        // Add children to queue and assign them depth + 1
        const children = adjList.get(currentId) || [];
        children.forEach(childId => {
          if (!visited.has(childId)) {
            const childNode = nodesMap.get(childId)!;
            childNode.depth = currentNode.depth! + 1;
            queue.push(childId);
          }
        });
      }
    }

    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;

    const simulation = d3
      .forceSimulation<GraphNode, GraphLink>(nodes)
      .force("link", d3.forceLink<GraphNode, GraphLink>(links).id((d) => d.id).distance(150))
      .force("charge", d3.forceManyBody().strength(-650))
      .force("center", d3.forceCenter(centerX, centerY))
      .force("collide", d3.forceCollide<GraphNode>().radius(d => (d.radius || 16) + 20))
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

  // --- D3 Zoom Behavior ---
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3Selection.select(svgRef.current);

    const zoomBehavior = d3Zoom
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 3]) // Limit zoom out to 0.1x, zoom in to 3x
      .filter((event) => {
        // Always allow the scroll wheel to zoom
        if (event.type === "wheel") return true;

        // Only allow panning if the clicked element is NOT inside 'node-group'
        return !event.target.closest(".node-group") && !event.button; // !event.button ensures it's a left click
      })
      .on("zoom", (e) => {
        setTransform(e.transform);
        transformRef.current = e.transform; // Keep ref synced for drag math
      });

    // Attach the zoom behavior to the SVG
    svg.call(zoomBehavior);

    return () => {
      svg.on(".zoom", null); // Cleanup
    };
  }, []);

  // --- Drag Interactions ---
  const onPointerDown = useCallback((e: React.PointerEvent, node: GraphNode) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    draggedNodeRef.current = node;
    node.fx = node.x;
    node.fy = node.y;
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const container = containerRef.current;
    const draggedNode = draggedNodeRef.current;

    if (!draggedNode || !container) return;

    const bounds = container.getBoundingClientRect();
    const rawX = e.clientX - bounds.left;
    const rawY = e.clientY - bounds.top;

    // We must divide by the zoom scale so the node doesn't jump
    const currentZoom = transformRef.current;
    draggedNode.fx = (rawX - currentZoom.x) / currentZoom.k;
    draggedNode.fy = (rawY - currentZoom.y) / currentZoom.k;

    if (simulationRef.current) {
      simulationRef.current.alphaTarget(0.3).restart();
    }
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent, node: GraphNode) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    draggedNodeRef.current = null;
    node.fx = null;
    node.fy = null;

    if (simulationRef.current) {
      simulationRef.current.alphaTarget(0);
    }
  }, []);

  return {
    containerRef,
    svgRef,
    transform,
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