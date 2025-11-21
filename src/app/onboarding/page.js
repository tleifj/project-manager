"use client";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OnboardingPage() {
  // Handle Loading State when form submits
  const [loading, setLoading] = useState(false);

  const supabase = createClient();
  const router = useRouter();
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const orgName = formData.get("orgName");

    if (!orgName) {
      return;
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error(userError || new Error("No authenticated user"));
      return;
    }

    await fetch("/api/organization/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: orgName, userId: user.id }),
    });

    router.push("/");
    setLoading(false);
  };

  return (
    <main>
      <h1>Add an Organization</h1>
      <p>Enter your organization name</p>
      <form onSubmit={onSubmit} disabled={loading}>
        <input type="text" name="orgName" />
        <button type="submit">Add Organization</button>
      </form>
    </main>
  );
}
