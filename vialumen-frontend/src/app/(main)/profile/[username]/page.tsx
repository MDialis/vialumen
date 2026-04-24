import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays } from "lucide-react";
import { getUserProfile } from "@/lib/api";

export default async function PublicProfilePage({ 
    params 
}: { 
    params: Promise<{ username: string }> 
}) {
    const resolvedParams = await params;
    const user = await getUserProfile(resolvedParams.username);

    // If it returns null (404, server error, etc.), show the Not Found page
    if (!user) {
        notFound();
    }

    // Format the date
    const joinDate = new Date(user.createdAt).toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
    });

    return (
        <div className="max-w-4xl mx-auto p-4 mt-8">
            <Card className="overflow-hidden border-none shadow-md">
                <div className="h-32 w-full bg-muted" />
                
                <CardContent className="relative px-6 pb-6">
                    <div className="absolute -top-12 flex justify-between items-end w-full pr-12">
                        <Avatar className="w-24 h-24 border-4 border-background shadow-sm">
                            <AvatarImage src={user.image || ""} alt={user.name} />
                            <AvatarFallback className="text-2xl font-bold">
                                {user.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    <div className="mt-14">
                        <h1 className="text-2xl font-bold">{user.name}</h1>
                        <p className="text-muted-foreground text-sm">@{user.username}</p>

                        <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                            <CalendarDays className="w-4 h-4" />
                            <span>Joined {joinDate}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}