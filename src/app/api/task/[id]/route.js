import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req, { params }) {
  try {
    const taskId = parseInt(params.id);
    const body = await req.json();

    const result = await prisma.task.update({
      where: { id: taskId },
      data: {
        name: body.name,
        description: body.description || "test",
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        status: {
          connect: { id: parseInt(body.status) },
        },
        users: {
          set: [], // First disconnect all users
          connect: body.userIds ? body.userIds.map(id => ({ id: parseInt(id) })) : [], // Then connect selected users
        },
      },
      include: { project: true, status: true, users: true },
    });

    return Response.json(result);
  } catch (error) {
    console.error("Error updating task:", error);
    return Response.json(
      { error: "Failed to update task", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
  try {
    const taskId = parseInt(params.id);
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true, status: true, users: true },
    });

    if (!task) {
      return Response.json({ error: "Task not found" }, { status: 404 });
    }

    return Response.json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    return Response.json(
      { error: "Failed to fetch task", details: error.message },
      { status: 500 }
    );
  }
}
