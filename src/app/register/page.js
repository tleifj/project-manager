"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export default function RegisterPage() {
  const [orgName, setOrgName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const startGoogle = async () => {
    setError("");
    const name = orgName?.trim() || "My Organization";
    localStorage.setItem("pending_org_name", name);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/onboarding` },
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 text-black p-6">
      <div className="w-full max-w-sm p-8 bg-white rounded shadow-md space-y-6 text-black">
        <button
          type="button"
          onClick={startGoogle}
          className="w-full py-2 px-4 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60"
          disabled={loading}
          aria-label="Continue with Google"
        >
          {loading ? "Continuing..." : "Continue with Google"}
        </button>
        <p className="text-xs text-gray-600 text-center">
          You will be redirected to Google to sign in. After returning, we’ll
          create your Organization.
        </p>
      </div>
    </main>
  );
}
