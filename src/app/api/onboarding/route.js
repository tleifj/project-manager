import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req) {
  const supabase = await createClient();

  try {
    // Check if user already has an organization mapping
    const { data: existingMap, error: mapErr } = await supabase
      .from("user_organizations")
      .select("organizationId")
      .eq("userId", userId)
      .maybeSingle();

    if (mapErr) throw mapErr;

    if (existingMap?.organizationId) {
      // Already onboarded
      const { data: org } = await supabase
        .from("organizations")
        .select("*")
        .eq("id", existingMap.organizationId)
        .maybeSingle();
      return NextResponse.json(
        { organization: org, created: false },
        { status: 200 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const orgName = (body?.organizationName || "My Organization")
      .toString()
      .slice(0, 255);

    // Create Organization (createdBy set by trigger, RLS allows insert by creator)
    const { data: org, error: orgErr } = await supabase
      .from("organizations")
      .insert({ name: orgName })
      .select("*")
      .single();
    if (orgErr) throw orgErr;

    // Map user -> organization (single organization per user)
    const { error: uoErr } = await supabase
      .from("user_organizations")
      .insert({ userId: userId, organizationId: org.id });
    if (uoErr) throw uoErr;

    // Create default workspace
    const { data: ws, error: wsErr } = await supabase
      .from("workspaces")
      .insert({ name: "Default", organizationId: org.id })
      .select("*")
      .single();
    if (wsErr) throw wsErr;

    return NextResponse.json(
      { organization: org, workspace: ws, created: true },
      { status: 201 }
    );
  } catch (e) {
    const message = e?.message || "Failed to onboard";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
