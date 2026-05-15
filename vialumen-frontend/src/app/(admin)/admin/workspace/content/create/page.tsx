import { redirect } from "next/navigation";
import { getSubthemes } from "@/lib/api";
import OfficialContentForm from "@/components/content-form";
import { ThemeWrapper } from "@/components/theme-wrapper";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import NoCredentialsMessage from "@/components/not-admin-message";

export default async function CreateOfficialContentPage() {
  // Secure Server-Side Auth Fetching
  const session = await auth.api.getSession({ headers: await headers() });

  // If not logged in at all -> redirect to main page (or use notFound())
  if (!session?.user) {
    redirect("/");
  }

  // If logged in, but NOT an admin -> show unauthorized UI
  if (session.user.role !== "admin") {
    return (
      <NoCredentialsMessage />
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