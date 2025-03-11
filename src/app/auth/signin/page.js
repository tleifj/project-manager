"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

export default function SignIn() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleSignIn = async (provider) => {
    try {
      await signIn(provider, { callbackUrl: "/" });
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="mt-2 text-gray-600">Sign in to access your projects</p>
          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-4 text-red-600">
              {error === "OAuthAccountNotLinked"
                ? "This email is already associated with a different sign-in method. Please use your original sign-in method."
                : "An error occurred during sign in. Please try again."}
            </div>
          )}
        </div>

        <div className="mt-8 space-y-4">
          {/* <Button
            className="w-full"
            onClick={() => signIn("github", { callbackUrl: "/" })}
          >
            Sign in with GitHub
          </Button> */}

          <Button className="w-full" onClick={() => handleSignIn("google")}>
            Sign in with Google
          </Button>
        </div>
      </div>
    </div>
  );
}
