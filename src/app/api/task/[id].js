// This is the API endpoint for single tasks

// This is needed to interact with database via Prisma
import { PrismaClient } from "@prisma/client";

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  const prisma = new PrismaClient();

  if (method === "GET") {
    console.log(id);

    const task = await prisma.task.findUnique({
      where: {
        id: parseInt(id),
      },
      include: { users: true },
    });
    res.status(200).json({ success: true, data: task });
  }

  if (method === "PUT") {
    const { body } = req;
    const { data } = await prisma.task.update({
      where: { id: parseInt(id) },
      data: {
        name: body.name,
        description: body.description,
        users: {
          set: [{ id: parseInt(body.users) }],
        },
      },
      include: { users: true },
    });
    res.status(200).json(data);
  }
}
