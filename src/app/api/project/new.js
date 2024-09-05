// This is the endpoint for creating a new project

// This is needed to interact with database via Prisma
import { PrismaClient } from "@prisma/client";

export default async function handler(req, res) {
  const prisma = new PrismaClient();

  //   if (method === "POST") {
  const { body } = req;
  console.log(body);
  const { result } = await prisma.project.create({
    data: {
      name: body.name,
      description: body.description,
      workspace: {
        connect: { id: 2 },
      },
    },
    // include: { workspace: true },
  });
  res.status(200).json(result);
}
// }
