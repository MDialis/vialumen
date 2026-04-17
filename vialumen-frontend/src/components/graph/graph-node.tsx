import { useRef } from "react";
import { GraphNode as GraphNodeType } from "@/hooks/use-force-graph";

interface GraphNodeProps {
  node: GraphNodeType;
  onClick: (slug: string) => void;
  onPointerDown: (e: React.PointerEvent, node: GraphNodeType) => void;
  onPointerUp: (e: React.PointerEvent, node: GraphNodeType) => void;
}

export const GraphNode = ({ node, onClick, onPointerDown, onPointerUp }: GraphNodeProps) => {
  const clickData = useRef({ x: 0, y: 0, time: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    clickData.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now()
    };

    onPointerDown(e, node);
  };

  const handleClick = (e: React.MouseEvent) => {
    const dx = Math.abs(e.clientX - clickData.current.x);
    const dy = Math.abs(e.clientY - clickData.current.y);
    const dt = Date.now() - clickData.current.time;

    if (dx > 15 || dy > 15 || dt > 250) {
      e.preventDefault();
      return;
    }

    onClick(node.slug);
  };

  const radius = node.radius || 12;

  return (
    <g
      transform={`translate(${node.x || 0}, ${node.y || 0})`}
      style={{ cursor: "pointer" }}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerUp={(e) => onPointerUp(e, node)}
      className="group node-group"
    >
      {/* Tooltip text */}
      <title>{node.description || node.title}</title>

      {/* The colored circle */}
      <circle
        r={radius}
        fill="var(--primary)"
        className="transition-all duration-300 group-hover:scale-115 group-hover:fill-secondary"
      />

      {/* The label below the circle */}
      <text
        y={radius + 16}
        textAnchor="middle"
        fill="var(--foreground)"
        className="
            text-xs font-medium 
            pointer-events-none select-none 
            transition-all duration-300 
            group-hover:font-bold group-hover:scale-115"
      >
        {node.title}
      </text>
    </g>
  );
};