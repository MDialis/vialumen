import { useRef } from "react";
import { GraphNode as GraphNodeType } from "@/hooks/useForceGraph";

interface GraphNodeProps {
  node: GraphNodeType;
  onClick: (slug: string) => void;
  onPointerDown: (e: React.PointerEvent, node: GraphNodeType) => void;
  onPointerUp: (e: React.PointerEvent, node: GraphNodeType) => void;
}

export const GraphNode = ({ node, onClick, onPointerDown, onPointerUp }: GraphNodeProps) => {
  const clickStartPos = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    clickStartPos.current = { x: e.clientX, y: e.clientY };

    onPointerDown(e, node);
  };

  const handleClick = (e: React.MouseEvent) => {
    const dx = Math.abs(e.clientX - clickStartPos.current.x);
    const dy = Math.abs(e.clientY - clickStartPos.current.y);

    if (dx > 5 || dy > 5) {
      e.preventDefault();
      return;
    }

    onClick(node.slug);
  };

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
        r={24}
        fill="var(--primary)"
        className="transition-all duration-300 group-hover:scale-115 group-hover:fill-secondary"
      />

      {/* The label below the circle */}
      <text
        y={40}
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