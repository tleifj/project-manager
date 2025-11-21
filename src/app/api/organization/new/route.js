import { PrismaClient } from "@prisma/client";

export async function POST(req) {
  const prisma = new PrismaClient();

  //   Get the body of the request
  const body = await req.json();
  const organization = await prisma.organization.create({
    data: {
      name: body.name,
      description: "test",
      createdBy: body.userId,
    },
  });

  // 2. Create UserOrganization linking current user to this org
  const userOrganization = await prisma.userOrganization.create({
    data: {
      userId: body.userId, // from request (for now)
      organizationId: organization.id, // from created org
    },
  });

  return Response.json({
    organization,
    userOrganization,
  });
}
