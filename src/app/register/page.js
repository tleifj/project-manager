"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setError(error.message || "Registration failed.");
    } else {
      setSuccess("Registration successful! Please check your email to verify your account.");
      setTimeout(() => router.push("/login"), 2500);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 text-black">
      <form
        className="w-full max-w-sm p-8 bg-white rounded shadow-md space-y-6 text-black"
        onSubmit={handleSubmit}
        aria-label="Register form"
      >
        <h1 className="text-2xl font-bold text-center">Create your account</h1>
        {error && (
          <div className="text-red-600 text-sm" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className="text-green-600 text-sm" role="status">
            {success}
          </div>
        )}
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
            onChange={(e) => setEmail(e.target.value)}
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
            autoComplete="new-password"
            required
            minLength={6}
            className="block w-full rounded border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-base px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-required="true"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
        <div className="flex items-center justify-center">
          <span className="text-gray-500 text-sm">
            Already have an account?
          </span>
          <a href="/login" className="ml-2 text-blue-600 underline text-sm">
            Sign in
          </a>
        </div>
      </form>
    </main>
  );
}
