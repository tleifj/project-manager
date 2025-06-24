import { PrismaClient } from "@prisma/client";

export async function DELETE(request, { params }) {
  const prisma = new PrismaClient();
  const { id } = params;

  try {
    await prisma.status.delete({
      where: {
        id: parseInt(id),
      },
    });

    return Response.json({ message: "Status deleted successfully" });
  } catch (error) {
    return Response.json({ error: "Failed to delete status" }, { status: 500 });
  }
}
