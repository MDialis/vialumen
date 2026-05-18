import Link from "next/link";
import { ThemeWrapper } from "@/components/theme-wrapper";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PenBox, Users, Inbox } from "lucide-react";

export default async function AdminWorkspacePage() {
  return (
    <ThemeWrapper>
      <div className="min-h-screen p-8 ">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Dashboard Header */}
          <div>
            <h1 className="text-4xl font-black tracking-tight">Admin Workspace</h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Manage content, moderate users, and oversee the platform.
            </p>
          </div>

          <Separator className="bg-border" />

          {/* Action Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Create Content Card */}
            <Link
              href="/admin/workspace/content/create"
              className="block group"
            >
              <Card className="h-full transition-all duration-200 group-hover:border-primary group-hover:bg-primary/10 cursor-pointer">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                    <PenBox className="text-primary group-hover:brightness-110" />
                  </div>
                  <CardTitle className="text-xl">Post Official Content</CardTitle>
                  <CardDescription className="text-base mt-2">
                    Draft, format, and submit content to a subtheme type.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            {/* Manage Users Card */}
            <Link
              href="/admin/workspace/users"
              className="block group"
            >
              <Card className="h-full transition-all duration-200 group-hover:border-primary group-hover:bg-primary/10 cursor-pointer">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                    <Users className="text-primary group-hover:brightness-110" />
                  </div>
                  <CardTitle className="text-xl">
                    User Management
                  </CardTitle>

                  <CardDescription className="text-base mt-2">
                    View accounts, moderate behavior, and adjust platform access levels.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            {/* Content Requests (Future Feature Placeholder) */}
            <Card className="h-full border-border/50 bg-card/50 opacity-75 relative overflow-hidden">
              <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
                <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-bold tracking-wider uppercase shadow-sm">
                  Coming Soon
                </span>
              </div>
              <CardHeader className="relative z-0">
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4">
                  <Inbox className="w-6 h-6 text-muted-foreground" />
                </div>
                <CardTitle className="text-xl text-muted-foreground">Content Requests</CardTitle>
                <CardDescription className="text-base mt-2">
                  Review user posts and edit them for official induction.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </ThemeWrapper>
  );
}