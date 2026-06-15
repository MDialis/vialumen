import { getHierarchyGraph } from "@/lib/api";
import Link from "next/link";
import { SubthemeResponse } from "@/types";

// Recursive component to render children cleanly
function TreeNode({
  node,
  childrenMap,
  activeTheme,
}: {
  node: SubthemeResponse;
  childrenMap: Record<string, SubthemeResponse[]>;
  activeTheme: string;
}) {
  const children = childrenMap[node.id] || [];

  return (
    <div className="flex flex-col">
      <Link
        href={`/path/${node.slug}?theme=${activeTheme}`}
        className="group flex flex-col py-2 px-3 rounded-md hover:bg-muted/50 transition-colors"
      >
        <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
          {node.title}
        </h4>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {node.description}
        </p>
      </Link>

      {/* Render children with an indented left border line */}
      {children.length > 0 && (
        <div className="ml-3 pl-3 border-l-2 border-border/60 flex flex-col">
          {children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              childrenMap={childrenMap}
              activeTheme={activeTheme}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export async function HierarchyListView({ hierarchyId }: { hierarchyId: string }) {
  const data = await getHierarchyGraph(hierarchyId);

  if (!data || !data.nodes || data.nodes.length === 0) {
    return (
      <div className="p-10 text-center text-muted-foreground border border-dashed rounded-xl bg-card">
        No mapping available for this hierarchy yet.
      </div>
    );
  }

  // Build a fast lookup map for children
  const childrenMap: Record<string, SubthemeResponse[]> = {};
  const isTarget = new Set<string>();

  data.edges.forEach((edge) => {
    // Ensure we are comparing strings since JSON types can mix numbers/strings
    const sourceId = String(edge.source);
    const targetId = String(edge.target);

    if (!childrenMap[sourceId]) childrenMap[sourceId] = [];

    const targetNode = data.nodes.find((n) => String(n.id) === targetId);
    if (targetNode) {
      childrenMap[sourceId].push(targetNode);
      isTarget.add(targetId);
    }
  });

  // Identify Root Nodes (Nodes that are never targets of any edge)
  const rootNodes = data.nodes.filter((n) => !isTarget.has(String(n.id)));

  return (
    <div
      className="rounded-xl h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/60 [&::-webkit-scrollbar-thumb]:rounded-full"
    >
      <div className="flex flex-col">
        {rootNodes.map((root) => (
          <TreeNode
            key={root.id}
            node={root}
            childrenMap={childrenMap}
            activeTheme={hierarchyId}
          />
        ))}
      </div>
    </div>
  );
}