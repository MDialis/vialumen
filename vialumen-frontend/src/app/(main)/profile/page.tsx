"use client";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const { data: session } = authClient.useSession();

  return (
    <div>
      <h1>Howdy {session?.user.name}!</h1>
      <p>Your email is {session?.user.email} i guess</p>
      <button onClick={() => authClient.signOut()}>Log Out... ?</button>
    </div>
  )
}