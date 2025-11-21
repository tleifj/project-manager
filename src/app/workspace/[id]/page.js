import { PrismaClient } from "@prisma/client";
import Task from "../../components/Task";
import Link from "next/link";
import Topbar from "../../components/Topbar";
import NewProject from "../../components/NewProject";
const prisma = new PrismaClient();

export default async function SingleWorkspace({ params }) {
  console.log(params.id);
  const workspace = await prisma.workspace.findUnique({
    where: {
      id: params.id,
    },
  });
  if (workspace) {
    workspace.createdAt = workspace.createdAt.toString();
    workspace.updatedAt = workspace.updatedAt.toString();
  }

  const projectsResults = await prisma.project.findMany({
    where: {
      workspaceId: params.id,
    },
    // include: { users: true },
  });

  const projects = projectsResults.map((project) => {
    // console.log(project.users);
    project.createdAt = project.createdAt.toString();
    project.updatedAt = project.updatedAt.toString();
    // if (project.users.length > 0) {
    //   const users = project.users.map((user) => {
    //     // user.createdAt = user.createdAt.toString();
    //     user.createdAt = user.createdAt.toString();
    //     user.updatedAt = user.updatedAt.toString();
    //     // console.log(user);
    //     // user.assignedAt = user.assignedAt.toString();
    //     return user;
    //   });
    // }
    return project;
  });

  console.log(projects);

  return (
    <>
      {/* <Topbar name={project.name} workspace={{ ...workspace }}></Topbar> */}
      <div className="py-8">
        <div className="flex w-full py-2 border-b justify-between text-sm gap-4">
          <div className="flex-[0_0_33%]">Name</div>
          <div className="table-cell">Status</div>
          <div className=" flex gap-4">
            <div className="table-cell">Start</div>
            <div className="table-cell">Finish</div>
          </div>
        </div>
        {projects.map((project) => {
          return (
            <Link
              key={project.id}
              href="/project/[id]"
              as={`/project/${project.id}`}
            >
              <span>{project.name}</span>
            </Link>
          );
        })}

        <NewProject workspaceId={params.id} />
      </div>
    </>
  );
}
