import { PrismaClient } from "@prisma/client";

export async function GET(request) {
  const prisma = new PrismaClient();

  //   if (method === "GET") {
  //   console.log(req);
  // const results = await prisma.workspace.findMany({});
  // get all workspaces and their prpjects
  const results = await prisma.workspace.findMany({
    include: {
      projects: true,
    },
  });
  const workspaces = results.map((workspace) => {
    workspace.createdAt = workspace.createdAt.toString();
    workspace.updatedAt = workspace.updatedAt.toString();
    return workspace;
  });
  //   console.log(result);
  // res.status(200).json(workspaces);
  return Response.json({ workspaces });
  //   } else {
  //     res.status(405).json({ message: "Method not allowed" });
  //   }
}
