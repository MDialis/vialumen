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

    const handleOAuth = async (provider: "google" | "apple" | "facebook" | "discord" | "gitlab" | "github") => {
        await authClient.signIn.social({ provider, callbackURL: "/dashboard" });
    };

    const handlePasskeyLogin = async () => {
        setIsCheckingPasskey(true);
        setErrorMsg("");

        try {
            const { data, error } = await authClient.signIn.passkey();

            if (data) {
                router.push("/dashboard");
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
        <Card className="max-w-md mx-auto mt-12 border shadow-sm">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
            </CardHeader>
            <CardContent>
                {/* OAuth Buttons */}
                <div className="space-y-3 mb-6">
                    <Button
                        variant="outline"
                        className="w-full p-6 text-base"
                        onClick={() => handleOAuth("google")}
                    >
                        Continue with Google
                    </Button>
                    <Button
                        className="w-full p-6 text-base bg-black text-white hover:bg-zinc-800"
                        onClick={() => handleOAuth("apple")}
                    >
                        Continue with Apple
                    </Button>

                    <div className="grid grid-cols-2 gap-3 mt-3">
                        <Button variant="outline" className="w-full" onClick={() => handleOAuth("facebook")}>
                            Facebook
                        </Button>
                        <Button variant="outline" className="w-full" onClick={() => handleOAuth("discord")}>
                            Discord
                        </Button>
                        <Button variant="outline" className="w-full" onClick={() => handleOAuth("github")}>
                            GitHub
                        </Button>
                        <Button variant="outline" className="w-full" onClick={() => handleOAuth("gitlab")}>
                            GitLab
                        </Button>
                    </div>
                </div>

                {/* Divider */}
                <div className="relative flex py-4 items-center">
                    <div className="flex-grow border-t border-border"></div>
                    <span className="flex-shrink-0 mx-4 text-muted-foreground text-sm">or</span>
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
                        <AlertDescription className="ml-2">
                            {errorMsg}
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
}