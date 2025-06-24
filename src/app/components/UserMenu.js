"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

console.log("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function UserMenu() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user || null);
    };
    getSession();
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getSession();
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  if (!user) return null;

  return (
    <nav aria-label="User menu" className="flex items-center space-x-4">
      <span className="text-base text-gray-700" aria-label="Signed in user email">
        {user.email}
      </span>
      <button
        onClick={async () => { await supabase.auth.signOut(); window.location.reload(); }}
        className="py-1 px-4 rounded bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Sign out"
      >
        Sign out
      </button>
    </nav>
  );
}
