import { Button } from "@/components/ui/button";
import { Flame, House } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const NAV_FEEDS = [
  {
    id: "home",
    label: "Recommended",
    icon: House,
    href: "/community?feed=home",
  },
  {
    id: "trending",
    label: "Trending",
    icon: Flame,
    href: "/community?feed=trending",
  },
];

export function CommunitySidebar({ feedType }: { feedType: string }) {
  return (
    <aside className="w-full md:w-60 flex-shrink-0 p-4">
      <div className="sticky space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Feeds
        </h2>

        <nav className="flex flex-col gap-1">
          {NAV_FEEDS.map((feed) => {
            const isActive = feedType === feed.id;
            const Icon = feed.icon;

            return (
              <Button
                key={feed.id}
                asChild
                variant="ghost"
                className={cn(
                  "w-full justify-start h-10 rounded-xl transition-colors duration-200",
                  isActive
                    ? "font-bold bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
                    : "font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Link href={feed.href}>
                  <Icon
                    className={cn(
                      "w-5 h-5 mr-3 transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground",
                    )}
                  />
                  {feed.label}
                </Link>
              </Button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
