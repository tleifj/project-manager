"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export default function UserMenu() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user || null);
    };
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user || null);
    };
    getUser();
    // getSession();
    // const { data: listener } = supabase.auth.onAuthStateChange(() => {
    //   getSession();
    // });
    // return () => {
    //   listener?.subscription.unsubscribe();
    // };
  }, []);

  if (!user) return null;

  return (
    <nav aria-label="User menu" className="flex items-center space-x-4">
      <span
        className="text-base text-gray-700"
        aria-label="Signed in user email"
      >
        {user.email}
      </span>
      <button
        onClick={async () => {
          await supabase.auth.signOut();
          window.location.reload();
        }}
        className="py-1 px-4 rounded bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Sign out"
      >
        Sign yourself out
      </button>
    </nav>
  );
}
