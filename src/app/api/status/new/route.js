import { PrismaClient } from "@prisma/client";

export async function POST(req) {
  const prisma = new PrismaClient();

  //   Get the body of the request
  const body = await req.json();
  console.log(body);
  const result = await prisma.status.create({
    data: {
      name: body.name,
    },
  });
  return Response.json(result);
}
