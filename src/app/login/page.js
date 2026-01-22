"use client";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export default function LoginPage() {
  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/` },
    });
  };

  return (
    <main className="min-h-dvh flex items-center justify-center bg-background text-foreground p-6">
      <div className="w-full max-w-sm rounded-lg border border-border bg-card text-card-foreground p-6 shadow-sm">
        <h1 className="mb-6 text-xl font-semibold text-gray-900">Sign in</h1>
        <button
          type="button"
          onClick={signInWithGoogle}
          className="w-full h-10 rounded-md bg-blue-600 px-4 font-medium hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          aria-label="Sign in with Google"
        >
          Sign in with Google
        </button>
        <p className="mt-4 text-sm text-center">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}
