import { redirect } from "next/navigation";
import Link from "next/link";
import { getSubthemes } from "@/lib/api";
import OfficialContentForm from "@/components/content-form";
import { ThemeWrapper } from "@/components/theme-wrapper";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function PostOfficialContentPage() {
  // Secure Server-Side Auth Fetching
  const session = await auth.api.getSession({ headers: await headers() });

  // If not logged in at all -> redirect to main page (or use notFound())
  if (!session?.user) {
    redirect("/");
  }

  // If logged in, but NOT an admin -> show unauthorized UI
  if (session.user.role !== "admin") {
    return (
      <ThemeWrapper>
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background text-foreground">
          <div className="max-w-md text-center space-y-6">
            <div className="flex items-center justify-center">
              <div className="flex justify-center">
                <ShieldAlert className="w-24 h-24 text-destructive" />
              </div>
              <div className="">
                <h1 className="text-3xl font-black tracking-tight mb-2">
                  Clearance Required
                </h1>
                <p className="text-muted-foreground">
                  Your current account credentials do not have the required privileges.
                </p>
              </div>
            </div>

            <Button asChild size="lg" className="mt-4 font-bold">
              <Link href="/">
                Go back
              </Link>
            </Button>
          </div>
        </div>
      </ThemeWrapper>
    );
  }

  // Fetch data (This is ONLY reached if the user IS logged in AND IS an admin)
  const subthemes = await getSubthemes();

  return (
    <ThemeWrapper>
      <div className="min-h-screen p-8 bg-background text-foreground">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight">Post Official Content</h1>
            <p className="text-muted-foreground mt-1 text-lg">
              Any post here WILL actually become a published article, no jokes here ok?.
            </p>
          </div>

          <Separator className="bg-border" />

          {/* Render the interactive client form */}
          <OfficialContentForm initialSubthemes={subthemes || []} />
        </div>
      </div>
    </ThemeWrapper>
  );
}