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
    label: "Trending Posts",
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
                variant="default"
                className={cn(
                  "w-full justify-start h-10 rounded-xl border-0 active:border-b-0 transition duration-200",
                  isActive
                    ? "font-bold bg-primary text-primary-foreground hover:brightness-130"
                    : "font-medium bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Link href={feed.href}>
                  <Icon
                    className="w-5 h-5 mr-3"
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
