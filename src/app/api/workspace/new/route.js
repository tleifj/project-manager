import { PrismaClient } from "@prisma/client";

export async function POST(req) {
  const prisma = new PrismaClient();

  //   Get the body of the request
  const body = await req.json();
  console.log(body);
  const result = await prisma.workspace.create({
    data: {
      name: body.name,
      description: body.description,
      organization: {
        connect: {
          id: body.organizationId,
        },
      },
    },
    // include: { workspace: true },
  });
  return Response.json(result);
}
