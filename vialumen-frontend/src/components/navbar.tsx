"use client";

import { useState } from "react";
import { Fredoka } from "next/font/google";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "./ui/input-group";
import Link from "next/link";
import UserButton from "./user-button";
import { LayoutDashboard, PlusCircle, Search, X } from "lucide-react";
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const isLoggedIn = !!session?.user;
  const isAdmin = session?.user?.role === "admin";

  const postRoute = isLoggedIn ? "/community/create" : "/login";

  return (
    <nav
      className={`top-0 z-50 w-full ${transparent ? "bg-transparent" : "sticky bg-constant-black"} ${fredoka.variable}`}
    >
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center">
        {isSearchOpen && !transparent ? (
          <>
            <InputGroup className="bg-muted text-muted-foreground w-full">
              <InputGroupInput placeholder="Type to search..." autoFocus />
              <InputGroupAddon align="inline-end">
                <InputGroupButton variant="ghost" className="bg-background">
                  Search
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(false)}
              className="text-constant-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <>
            <div
              className={`flex-1 flex justify-start ${transparent ? "hidden" : ""
                }`}
            >
              <Link href="/" className="hover:opacity-85 px-2 py-1 rounded-lg">
                <h1
                  className={`text-2xl font-semibold text-constant-white ${fredoka.className}`}
                >
                  VIALUMEN
                </h1>
              </Link>
            </div>

            <div className={`max-w-sm w-full ${transparent ? "hidden" : "hidden md:flex"}`}>
              <InputGroup className="bg-muted text-muted-foreground">
                <InputGroupInput placeholder="Type to search..." />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton variant="ghost" className="bg-background">
                    Search
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </div>

            <div className="flex-1 flex justify-end items-center gap-1 md:gap-4">
              {!transparent && (
                <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)} className="md:hidden font-medium text-constant-white/80 hover:text-constant-white">
                  <Search />
                </Button>
              )}
              {isAdmin && (
                <Link
                  href="/admin/workspace"
                  className="flex items-center gap-1.5 text-sm font-medium text-constant-white/80 hover:text-constant-white transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                </Link>
              )}
              <Button asChild variant={transparent ? "default" : "outline"} size="sm" className="rounded-full border-2">
                <Link href={postRoute} >
                  <PlusCircle className="w-4 h-4" />
                  <span className="hidden sm:inline-block font-semibold">Post</span>
                </Link>
              </Button>
              <UserButton />
            </div>
          </>
        )}
      </div>
    </nav>
  );
}