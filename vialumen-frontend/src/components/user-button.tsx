"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { User, Palette } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AppearanceSettings from "./appearance/appearance-settings";

export default function UserButton() {
  const { data: session, isPending } = authClient.useSession();
  const [isAppearanceOpen, setIsAppearanceOpen] = useState(false);

  if (isPending) {
    return (
      <div className="w-9 h-9 rounded-full bg-muted animate-pulse flex-shrink-0" />
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="w-9 h-9 rounded-full overflow-hidden border-2 border-transparent hover:border-primary transition flex-shrink-0 flex items-center justify-center bg-muted text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            title="Account Menu"
          >
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name}
                className="w-full h-full object-cover"
              />
            ) : session?.user ? (
              <div className="w-full h-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                {session.user.name.charAt(0).toUpperCase()}
              </div>
            ) : (
              <User className="w-5 h-5" />
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {!session ? (
            <DropdownMenuItem asChild>
              <Link href="/login" className="cursor-pointer w-full flex items-center">
                <User className="mr-2" />
                Log in
              </Link>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem asChild>
              <Link href="/profile" className="cursor-pointer w-full flex items-center">
                <User className="mr-2" />
                Profile
              </Link>
            </DropdownMenuItem>
          )}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem
            onSelect={() => setIsAppearanceOpen(true)}
            className="cursor-pointer flex items-center"
          >
            <Palette className="mr-2" />
            Appearance Settings
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AppearanceSettings
        open={isAppearanceOpen}
        onOpenChange={setIsAppearanceOpen}
      />
    </>
  );
}