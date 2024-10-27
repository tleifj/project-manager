import { PrismaClient } from "@prisma/client";

export async function POST(req) {
  const prisma = new PrismaClient();

  //   Get the body of the request
  const body = await req.json();
  console.log(body);
  const result = await prisma.task.create({
    data: {
      name: body.name,
      description: "test",
      project: {
        connect: { id: parseInt(body.projectId) },
      },
      status: {
        connect: { id: parseInt(body.status) },
      },
      //   users: {
      //     connect: [{ id: parseInt(body.users) }],
      //   },
    },
    include: { project: true, status: true },

    // include: { users: true, project: true },
  });
  return Response.json(result);
}
