"use client"; // Error components must be Client Components

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // This logs the error to your Vercel dashboard!
        console.error("Critical Application Error:", error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 text-center">
            <h2 className="text-3xl font-bold text-destructive mb-4">Connection Lost</h2>
            <p className="text-muted-foreground mb-8 max-w-md text-lg">
                We encountered an error while trying to retrieve this path. Our servers might be experiencing a disruption.
            </p>
            <div className="flex gap-4">
                <Button onClick={() => reset()} variant="default">
                    Try Again
                </Button>
                <Button asChild variant="outline">
                    <a href="/">Go Home</a>
                </Button>
            </div>
        </div>
    );
}