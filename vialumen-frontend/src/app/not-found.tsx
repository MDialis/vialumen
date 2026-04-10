import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GlobalNotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 text-center">
            <h1 className="text-6xl font-black text-primary mb-4">404</h1>
            <h2 className="text-2xl font-bold mb-2">Uncharted Territory</h2>
            <p className="text-muted-foreground mb-8 max-w-md text-lg">
                The path you are looking for does not exist in the current mapped hierarchy.
            </p>
            <Button asChild size="lg">
                <Link href="/">Return to Core</Link>
            </Button>
        </div>
    );
}