"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { User } from "lucide-react"; // Make sure lucide-react is installed

export default function UserButton() {
    const { data: session, isPending } = authClient.useSession();

    if (isPending) {
        return (
            <div className="w-9 h-9 rounded-full bg-muted animate-pulse flex-shrink-0" />
        );
    }

    if (!session) {
        return (
            <Link
                href="/login"
                className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition text-muted-foreground flex-shrink-0"
                title="Log in"
            >
                <User className="w-5 h-5" />
            </Link>
        );
    }

    return (
        <Link
            href="/profile"
            className="w-9 h-9 rounded-full overflow-hidden border-2 border-transparent hover:border-primary transition flex-shrink-0"
            title="Go to Profile"
        >
            {session.user.image ? (
                <img
                    src={session.user.image}
                    alt={session.user.name}
                    className="w-full h-full object-cover"
                />
            ) : (
                <div className="w-full h-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    {session.user.name.charAt(0).toUpperCase()}
                </div>
            )}
        </Link>
    );
}