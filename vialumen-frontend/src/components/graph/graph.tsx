"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { HierarchyGraphResponse } from "@/types";
import { useRouter } from "next/navigation";

interface GraphProps {
    data: HierarchyGraphResponse;
    hierarchyId: string;
}

export default function Graph({ data, hierarchyId }: GraphProps) {
    const graphRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
    const [themeColors, setThemeColors] = useState({
        node: "#1c327f",
        link: "#646464",
        text: "#000000",
    });

    // Auto-resize the canvas
    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new ResizeObserver((entries) => {
            const { width, height } = entries[0].contentRect;
            setDimensions({ width, height });
        });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    // Extract dynamic theme colors
    useEffect(() => {
        if (!containerRef.current) return;

        // Read the actual CSS variables being applied to this specific container
        const styles = getComputedStyle(containerRef.current);

        const primary = styles.getPropertyValue("--primary").trim();
        const muted = styles.getPropertyValue("--muted-foreground").trim();
        const foreground = styles.getPropertyValue("--foreground").trim();

        if (primary && muted) {
            setThemeColors({
                node: primary,
                link: muted,
                text: foreground,
            });
        }
    }, []);

    const processedEdges = [...data.edges];

    if (data.nodes.length > 0) {
        // Find the main node (Assuming its slug matches the hierarchyId)
        // If it doesn't match perfectly, fallback to the very first node in the array
        const mainNode = data.nodes.find(n => n.slug === hierarchyId) || data.nodes[0];

        // Get a Set of all node IDs that are currently being targeted by an edge
        const targetedNodeIds = new Set(data.edges.map(e => e.target));

        data.nodes.forEach((node) => {
            // If the node is NOT the main node, and nothing is connecting TO it...
            if (node.id !== mainNode.id && !targetedNodeIds.has(node.id)) {
                // ...create a virtual edge from the main node to this orphan node!
                processedEdges.push({
                    source: mainNode.id,
                    target: node.id
                });
            }
        });
    }

    const graphData = {
        nodes: data.nodes.map((node) => ({ ...node, val: 2 })),
        links: processedEdges.map((edge) => ({
            source: edge.source,
            target: edge.target,
        })),
    };

    const paintNodeText = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
        const label = node.title;

        // This math keeps the font size consistent on your screen no matter how far you zoom in/out
        const fontSize = 12 / globalScale;

        ctx.font = `${fontSize}px Sans-Serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillStyle = themeColors.text;

        // Draw the text slightly below the node (y + 8)
        ctx.fillText(label, node.x, node.y + 8);
    }, [themeColors.text]);

    // Handle Node Clicks
    const handleNodeClick = useCallback((node: any) => {
        if (graphRef.current) {
            graphRef.current.centerAt(node.x, node.y, 800);
            graphRef.current.zoom(4, 800);

            setTimeout(() => {
                router.push(`/${node.slug}`);
            }, 800);
        }
    }, [router]);

    return (
        <div ref={containerRef} className="w-full h-full min-h-[60vh] bg-background/50 rounded-2xl">
            <ForceGraph2D
                ref={graphRef}
                width={dimensions.width}
                height={dimensions.height}
                graphData={graphData}

                // Feed the dynamic CSS variables into the Canvas!
                nodeLabel="title" // Tooltip on hover
                nodeColor={() => themeColors.node}
                linkColor={() => themeColors.link}
                backgroundColor="transparent"

                // Custom Text Rendering
                nodeCanvasObjectMode={() => "after"}
                nodeCanvasObject={paintNodeText}

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