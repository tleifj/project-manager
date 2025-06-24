import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Creating task with body:", body);

    const result = await prisma.task.create({
      data: {
        name: body.name,
        description: "test",
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        project: {
          connect: { id: parseInt(body.projectId) },
        },
        status: {
          connect: { id: parseInt(body.status.toString().replace(/["']+/g, '')) },
        },
        users: body.userIds && body.userIds.length > 0 ? {
          connect: body.userIds.map(id => ({ id: parseInt(id) })),
        } : undefined,
      },
      include: { project: true, status: true, users: true },
    });

    return Response.json(result);
  } catch (error) {
    console.error("Error creating task:", error);
    return Response.json(
      { error: "Failed to create task", details: error.message },
      { status: 500 }
    );
  }
}
