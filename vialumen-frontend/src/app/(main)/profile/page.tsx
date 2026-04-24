"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Mail, AtSign, LogOut } from "lucide-react";

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();

  // Show a simple loading state while fetching the session
  if (isPending) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Loading profile...</p>
      </div>
    );
  }

  // Fallback if there's no session data
  if (!session?.user) {
    return null; 
  }

  const { name, email } = session.user;
  
  // Grab the first two letters of the name for the avatar fallback
  const initials = name?.substring(0, 2).toUpperCase() || "US";

  return (
    <div className="container max-w-2xl py-10 mx-auto">
      <Card className="w-full shadow-sm">
        <CardHeader className="flex flex-row items-center gap-5">
          <Avatar className="w-16 h-16 border">
            <AvatarFallback className="text-lg bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <CardTitle className="text-2xl">Howdy, {name}!</CardTitle>
            <CardDescription>Manage your profile information</CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 mt-2">
          <div className="grid gap-3">
            {/* Name Field */}
            <div className="flex items-center gap-4 p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-2 rounded-md bg-primary/10">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium leading-none">Name</p>
                <p className="text-sm text-muted-foreground mt-1.5">{name}</p>
              </div>
            </div>

            {/* Username Field */}
            <div className="flex items-center gap-4 p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-2 rounded-md bg-primary/10">
                <AtSign className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium leading-none">Username</p>

              </div>
            </div>

            {/* Email Field */}
            <div className="flex items-center gap-4 p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-2 rounded-md bg-primary/10">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium leading-none">Email Address</p>
                <p className="text-sm text-muted-foreground mt-1.5">{email}</p>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end pt-6 border-t mt-2">
          <Button
            variant="destructive"
            onClick={() => authClient.signOut()}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}