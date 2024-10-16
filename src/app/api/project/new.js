// This is the endpoint for creating a new project

// This is needed to interact with database via Prisma
import { PrismaClient } from "@prisma/client";

export default async function handler(req, res) {
  const prisma = new PrismaClient();

  //   if (method === "POST") {
  const { body } = req;
  const { result } = await prisma.project.create({
    data: {
      name: body.name,
      description: body.description,
      workspace: {
        connect: { id: parseInt(body.workspaceId) },
      },
    },
    // include: { workspace: true },
  });
  res.status(200).json(result);
}
// }
