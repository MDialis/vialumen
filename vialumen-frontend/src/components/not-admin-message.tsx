import { Link, ShieldAlert } from "lucide-react";
import { ThemeWrapper } from "./theme-wrapper";
import { Button } from "./ui/button";

export default function NoCredentialsMessage() {
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
  )
}