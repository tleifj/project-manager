import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@/utils/supabase/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Find the organization mapping for this user
    const mapping = await prisma.userOrganization.findUnique({
      where: { userId: user.id },
    });

    if (!mapping) {
      // User has no mapped organization yet
      return NextResponse.json({ organization: null }, { status: 200 });
    }

    const organization = await prisma.organization.findUnique({
      where: { id: mapping.organizationId },
    });

    return NextResponse.json({ organization }, { status: 200 });
  } catch (error) {
    console.error("Error fetching current organization:", error);
    return NextResponse.json(
      { error: "Failed to fetch current organization" },
      { status: 500 }
    );
  }
}
