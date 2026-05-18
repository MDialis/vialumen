"use client";

import { Fredoka } from "next/font/google";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "./ui/input-group";
import Link from "next/link";
import AppearanceSettings from "./appearance-settings";
import UserButton from "./user-button";
import { LayoutDashboard, PlusCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";

const fredoka = Fredoka({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fredoka",
});

interface NavbarProps {
  transparent?: boolean;
}

export default function Navbar({ transparent = false }: NavbarProps) {
  const { data: session } = authClient.useSession();

  const isLoggedIn = !!session?.user;
  const isAdmin = session?.user?.role === "admin";

  const postRoute = isLoggedIn ? "/community/create" : "/login";

  return (
    <nav
      className={`top-0 z-50 w-full ${transparent ? "bg-transparent" : "sticky bg-constant-black"} ${fredoka.variable}`}
    >
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center">
        <div className={`flex-1 flex justify-start ${transparent ? "hidden" : ""}`}>
          <Link href="/" className="hover:opacity-85 px-2 py-1 rounded-lg">
            <h1
              className={`text-2xl font-semibold text-constant-white ${fredoka.className}`}
            >
              VIALUMEN
            </h1>
          </Link>
        </div>

        <div className={`max-w-sm w-full ${transparent ? "hidden" : ""}`}>
          <InputGroup className="bg-muted text-muted-foreground">
            <InputGroupInput placeholder="Type to search..." />
            <InputGroupAddon align="inline-end">
              <InputGroupButton variant="ghost" className="bg-background">
                Search
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>

        <div className="flex-1 flex justify-end items-center gap-4">
          {isAdmin && (
            <Link
              href="/admin/workspace"
              className="flex items-center gap-1.5 text-sm font-medium text-constant-white/80 hover:text-constant-white transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
            </Link>
          )}

          {/* New Create Post Button */}
          <Button
            asChild
            variant={transparent ? "default" : "outline"}
            size="sm"
            className="rounded-full border-2"
          >
            <Link href={postRoute} className="flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline-block font-semibold">Post</span>
            </Link>
          </Button>

          <AppearanceSettings />
          <UserButton />
        </div>
      </div>
    </nav>
  );
}