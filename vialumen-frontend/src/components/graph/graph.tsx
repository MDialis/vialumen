"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { HierarchyGraphResponse, SubthemeResponse } from "@/types";

interface GraphProps {
    data: HierarchyGraphResponse;
}

export default function Graph({ data }: GraphProps) {
    const graphRef = useRef<any>(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
    const containerRef = useRef<HTMLDivElement>(null);

    // Auto-resize the canvas to fit your Tab container
    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new ResizeObserver((entries) => {
            const { width, height } = entries[0].contentRect;
            setDimensions({ width, height });
        });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    // Format the data for the force-graph engine
    const graphData = {
        nodes: data.nodes.map((node) => ({ ...node, val: 2 })), // 'val' determines node size
        links: data.edges.map((edge) => ({
            source: edge.source,
            target: edge.target,
        })),
    };

    // Center the camera on a node when clicked
    const handleNodeClick = useCallback((node: any) => {
        if (graphRef.current) {
            graphRef.current.centerAt(node.x, node.y, 1000);
            graphRef.current.zoom(4, 2000);
        }
    }, []);

    return (
        <div ref={containerRef} className="w-full h-full min-h-[60vh] bg-background/50 rounded-2xl">
            <ForceGraph2D
                ref={graphRef}
                width={dimensions.width}
                height={dimensions.height}
                graphData={graphData}

                nodeLabel="title" // Tooltip on hover
                nodeColor={() => "hsl(var(--primary))"}
                linkColor={() => "hsl(var(--muted-foreground) / 0.5)"}
                backgroundColor="transparent"

                // "Path" directional arrows
                linkDirectionalArrowLength={4}
                linkDirectionalArrowRelPos={1}

                // Interaction
                onNodeClick={handleNodeClick}

                // Physics settings
                d3VelocityDecay={0.3}
            />
        </div>
    );
}