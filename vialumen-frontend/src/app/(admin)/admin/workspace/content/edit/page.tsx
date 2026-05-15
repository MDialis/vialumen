import NoCredentialsMessage from "@/components/not-admin-message";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function EditPostIntoOfficialContentPage() {
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

  return (
    <div>
      Hellooo friends =D. That will be empty for a while
    </div>
  )
}