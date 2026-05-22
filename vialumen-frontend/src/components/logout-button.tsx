"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <Button
      variant="destructive"
      onClick={handleLogout}
      className="gap-2"
    >
      <LogOut className="w-4 h-4" />
      Log Out
    </Button>
  );
}