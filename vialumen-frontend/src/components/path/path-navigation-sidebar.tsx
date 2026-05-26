import { Button } from "@/components/ui/button";
import { Network, Users, ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PathNavigationSidebarProps {
  currentSlug: string;
}

export function PathNavigationSidebar({ currentSlug }: PathNavigationSidebarProps) {
  return (
    <div className="sticky top-24 space-y-8">
      
      {/* Global Navigation */}
      <div className="space-y-2">
        <h2 className="px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
          Explore
        </h2>
        <nav className="flex flex-col gap-1">
          <Button asChild variant="ghost" className="w-full justify-start h-10 font-medium text-muted-foreground hover:text-foreground">
            <Link href="/core">
              <Network className="w-4 h-4 mr-3" />
              Core Node Map
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start h-10 font-medium text-muted-foreground hover:text-foreground">
            <Link href="/community">
              <Users className="w-4 h-4 mr-3" />
              Community Feed
            </Link>
          </Button>
        </nav>
      </div>

      {/* Local Context (Placeholder for related nodes) */}
      <div className="space-y-2">
        <h2 className="px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
          Related Paths
        </h2>
        <div className="flex flex-col gap-1 border-l-2 border-border ml-6 pl-4">
          {/* You would ideally map over related subthemes fetched from your DB here */}
          
          <Link href="/path/creativity" className="text-sm py-1.5 text-muted-foreground hover:text-foreground transition-colors">
            Creativity
          </Link>
          
          {/* The Active State */}
          <span className="text-sm py-1.5 font-bold text-primary flex items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-primary absolute -ml-[21px]" />
            Current Topic
          </span>
          
          <Link href="/path/expression" className="text-sm py-1.5 text-muted-foreground hover:text-foreground transition-colors">
            Expression
          </Link>
        </div>
      </div>
    </div>
  );
}