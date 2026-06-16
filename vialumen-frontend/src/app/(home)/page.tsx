import { Fredoka } from "next/font/google";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import GlobalSearch from "@/components/global-search";

const fredoka = Fredoka({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fredoka",
});

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });
  const isLoggedIn = !!session?.user;

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-start bg-background text-foreground pt-12 px-4 gap-4 ${fredoka.variable}`}
    >
      {/* Header & Search */}
      <div className="pb-12 flex flex-col items-center max-w-2xl w-full gap-4">
        <div className="py-6 text-center">
          <h1
            className={`text-6xl font-semibold text-foreground ${fredoka.className}`}
          >
            VIALUMEN
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            The beginning of our journey.
          </p>
        </div>

        <div className="w-full">
          <GlobalSearch />
        </div>
      </div>

      {/* Card Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 w-full max-w-4xl mx-auto gap-6">
        {/* Node Maps Exploration */}
        <Card className="relative flex flex-col h-full hover:border-primary transition-colors duration-300">
          <CardHeader>
            <CardTitle>Explore Node Maps</CardTitle>
            <CardDescription className="mt-2 text-base">
              Navigate through our interconnected topics using an interactive
              visual map.
            </CardDescription>
          </CardHeader>
          <CardFooter className="mt-auto">
            <Link href="/core" className="w-full">
              <Button className="w-full font-semibold">Enter the Core</Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Community Feed CTA */}
        <Card className="relative flex flex-col h-full hover:border-primary transition-colors duration-300">
          <CardHeader>
            <CardTitle>Community Hub</CardTitle>
            <CardDescription className="mt-2 text-base">
              See what others are discussing, share your insights, and explore
              user-generated content.
            </CardDescription>
          </CardHeader>
          <CardFooter className="mt-auto">
            <Link href="/community" className="w-full">
              <Button variant="default" className="w-full font-semibold">
                Explore Discussions
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Account CTA */}
        {!isLoggedIn && (
          <Card className="relative flex flex-col h-full hover:border-primary transition-colors duration-300">
            <CardHeader>
              <CardTitle>Join the Community</CardTitle>
              <CardAction>
                <Badge variant="default" className="pointer-events-none">
                  New
                </Badge>
              </CardAction>
              <CardDescription className="mt-2 text-base">
                Create an account to track your progress and connect with
                others.
              </CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto">
              <Link href="/login" className="w-full">
                <Button variant="default" className="w-full font-semibold">
                  Sign Up
                </Button>
              </Link>
            </CardFooter>
          </Card>
        )}

        {/* Placeholder */}
        {isLoggedIn && (
          <Card className="relative flex flex-col h-full border-dashed border-border/60 bg-muted/30">
            <CardHeader>
              <CardTitle className="text-muted-foreground">
                More to Come
              </CardTitle>
              <CardDescription className="mt-2 text-base">
                Stay tuned for new features, modules, and pathways currently in
                development.
              </CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto">
              <Button
                variant="ghost"
                className="w-full text-muted-foreground"
                disabled
              >
                Coming Soon
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </main>
  );
}
