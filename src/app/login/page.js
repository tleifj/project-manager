"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setError(error.message || "Invalid email or password");
    } else {
      router.replace("/");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <form
        className="w-full max-w-sm p-8 bg-white rounded shadow-md space-y-6"
        onSubmit={handleSubmit}
        aria-label="Login form"
      >
        <h1 className="text-2xl font-bold text-center">Sign in to your account</h1>
        {error && <div className="text-red-600 text-sm" role="alert">{error}</div>}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="block w-full rounded border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-base px-3 py-2"
            value={email}
            onChange={e => setEmail(e.target.value)}
            aria-required="true"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="block w-full rounded border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-base px-3 py-2"
            value={password}
            onChange={e => setPassword(e.target.value)}
            aria-required="true"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <div className="flex items-center justify-center">
          <span className="text-gray-500 text-sm">or</span>
        </div>
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded px-4 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none"
          onClick={async () => {
            setLoading(true);
            setError("");
            const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
            setLoading(false);
            if (error) {
              setError(error.message || "Google sign-in failed");
            } else {
              router.replace("/");
            }
          }}
          aria-label="Sign in with Google"
        >
          <svg className="w-5 h-5" viewBox="0 0 48 48">
            <g>
              <path fill="#4285F4" d="M24 9.5c3.54 0 6.46 1.22 8.44 3.22l6.25-6.25C34.99 2.56 29.97 0 24 0 14.82 0 6.95 5.82 3.14 14.09l7.67 5.96C12.34 13.42 17.69 9.5 24 9.5z"/>
              <path fill="#34A853" d="M46.14 24.5c0-1.64-.15-3.21-.43-4.72H24v9.01h12.42c-.54 2.88-2.17 5.33-4.62 6.98l7.14 5.56C43.97 37.44 46.14 31.45 46.14 24.5z"/>
              <path fill="#FBBC05" d="M10.81 28.04c-1.09-3.23-1.09-6.81 0-10.04l-7.67-5.96C.59 16.12 0 20.01 0 24c0 3.99.59 7.88 3.14 11.05l7.67-5.96z"/>
              <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.14 15.9-5.82l-7.14-5.56c-2.01 1.35-4.59 2.17-8.76 2.17-6.31 0-11.66-3.92-13.19-9.55l-7.67 5.96C6.95 42.18 14.82 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </g>
          </svg>
          Sign in with Google
        </button>
      </form>
    </main>
  );
}
