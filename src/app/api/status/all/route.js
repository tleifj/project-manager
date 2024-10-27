import { PrismaClient } from "@prisma/client";

export async function GET(request) {
  const prisma = new PrismaClient();

  const results = await prisma.status.findMany({});
  const statuses = results.map((status) => {
    status.createdAt = status.createdAt.toString();
    status.updatedAt = status.updatedAt.toString();
    return status;
  });
  //   console.log(result);
  // res.status(200).json(statuss);
  return Response.json({ statuses });
  //   } else {
  //     res.status(405).json({ message: "Method not allowed" });
  //   }
}
