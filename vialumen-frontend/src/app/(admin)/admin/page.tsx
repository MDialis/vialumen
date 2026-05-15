import { redirect } from "next/navigation";
import { auth } from "@/lib/auth"; // Your auth import
import { headers } from "next/headers";

export default async function AdminBaseRoute() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user || session.user.role !== "admin") {
    redirect("/"); // Kick non-admins out entirely
  }

  redirect("/admin/workspace");
}