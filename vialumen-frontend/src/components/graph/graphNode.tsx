import { GraphNode as GraphNodeType } from "@/hooks/useForceGraph";

interface GraphNodeProps {
  node: GraphNodeType;
  onClick: (slug: string) => void;
  onPointerDown: (e: React.PointerEvent, node: GraphNodeType) => void;
  onPointerUp: (e: React.PointerEvent, node: GraphNodeType) => void;
}

export const GraphNode = ({ node, onClick, onPointerDown, onPointerUp }: GraphNodeProps) => {
  return (
    <g
      transform={`translate(${node.x || 0}, ${node.y || 0})`}
      style={{ cursor: "pointer" }}
      onClick={() => onClick(node.slug)}
      onPointerDown={(e) => onPointerDown(e, node)}
      onPointerUp={(e) => onPointerUp(e, node)}
      className="group"
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