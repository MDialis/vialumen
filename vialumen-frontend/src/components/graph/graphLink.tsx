import { GraphNode } from "@/hooks/useForceGraph";

export const GraphLink = ({ link }: { link: any }) => {
  const source = link.source as GraphNode;
  const target = link.target as GraphNode;

  return (
    <line
      x1={source.x}
      y1={source.y}
      x2={target.x}
      y2={target.y}
      stroke="var(--muted-foreground)"
      strokeWidth={2}
      opacity={0.6}
    />
  );
};