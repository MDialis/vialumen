"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";

export default function LoginScreen() {
  const router = useRouter();
  const [isCheckingPasskey, setIsCheckingPasskey] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleOAuth = async (
    provider: "google" | "facebook" | "discord" | "gitlab" | "github",
  ) => {
    await authClient.signIn.social({ provider, callbackURL: "/profile" });
  };

  const handlePasskeyLogin = async () => {
    setIsCheckingPasskey(true);
    setErrorMsg("");

    try {
      const { data, error } = await authClient.signIn.passkey();

      if (data) {
        router.push("/profile");
        return;
      }
      if (error) {
        setErrorMsg("No passkey found or prompt cancelled.");
      }
    } catch (err) {
      setErrorMsg("Failed to authenticate with Passkey.");
    } finally {
      setIsCheckingPasskey(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Welcome!
          </CardTitle>
        </CardHeader>

        <CardContent>
          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <Button
              variant="outline"
              className="w-full p-6 text-base flex items-center justify-center gap-2"
              onClick={() => handleOAuth("google")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className="w-5 h-5"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                ></path>
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                ></path>
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                ></path>
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                ></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
              </svg>
              Continue with Google
            </Button>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <Button
                variant="outline"
                className="w-full p-6 text-base flex items-center justify-center gap-2"
                onClick={() => handleOAuth("github")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </Button>

              <Button
                variant="outline"
                className="w-full p-6 text-base flex items-center justify-center gap-2"
                onClick={() => handleOAuth("gitlab")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                >
                  <path
                    fill="#e24329"
                    d="M23.955 13.587l-1.342-4.135-2.664-8.189c-.135-.423-.73-.423-.867 0L16.418 9.45H7.582L4.919 1.263c-.137-.423-.73-.423-.868 0L1.386 9.452.044 13.587c-.121.375.014.789.331 1.012l11.625 8.413 11.625-8.413c.316-.223.452-.637.33-1.012z"
                  />
                  <path
                    fill="#fc6d26"
                    d="M23.955 13.587l-1.342-4.135H16.418l7.537 4.135z"
                  />
                  <path
                    fill="#fca326"
                    d="M23.955 13.587l-1.342-4.135H16.418l7.537 4.135zM12 23.012l11.625-8.413H16.418L12 23.012z"
                  />
                  <path
                    fill="#fc6d26"
                    d="M.044 13.587l1.342-4.135h6.196L.044 13.587z"
                  />
                  <path
                    fill="#fca326"
                    d="M.044 13.587l1.342-4.135h6.196L.044 13.587zM12 23.012L.375 14.599h7.207L12 23.012z"
                  />
                </svg>
                GitLab
              </Button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink-0 mx-4 text-muted-foreground text-sm">
              or
            </span>
            <div className="flex-grow border-t border-border"></div>
          </div>

          {/* Passkey Button */}
          <Button
            onClick={handlePasskeyLogin}
            disabled={isCheckingPasskey}
            className="w-full p-6 text-base bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isCheckingPasskey ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Waiting for device...
              </>
            ) : (
              "Sign in with Passkey"
            )}
          </Button>

          {/* Error Message */}
          {errorMsg && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="ml-2">{errorMsg}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
