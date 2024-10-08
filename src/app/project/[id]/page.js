import { PrismaClient } from "@prisma/client";
import Task from "../../components/Task";
import Link from "next/link";
import Topbar from "../../components/Topbar";

const prisma = new PrismaClient();

export default async function SingleProject({ params }) {
  console.log(params.id);
  const project = await prisma.project.findUnique({
    where: {
      id: parseInt(params.id),
    },
  });
  console.log(project);
  if (project) {
    project.createdAt = project.createdAt.toString();
    project.updatedAt = project.updatedAt.toString();
  }

  const workspace = await prisma.workspace.findUnique({
    where: {
      id: project.workspaceId,
    },
  });

  const tasksResults = await prisma.task.findMany({
    where: {
      projectId: parseInt(params.id),
    },
    include: { users: true },
  });

  const tasks = tasksResults.map((task) => {
    // console.log(task.users);
    task.createdAt = task.createdAt.toString();
    task.updatedAt = task.updatedAt.toString();
    if (task.users.length > 0) {
      const users = task.users.map((user) => {
        // user.createdAt = user.createdAt.toString();
        user.createdAt = user.createdAt.toString();
        user.updatedAt = user.updatedAt.toString();
        // console.log(user);
        // user.assignedAt = user.assignedAt.toString();
        return user;
      });
    }
    return task;
  });
  return (
    <>
      <Topbar name={project.name} workspace={{ ...workspace }}></Topbar>
      <div className="py-8">
        <div className="flex w-full py-2 border-b justify-between text-sm gap-4">
          <div className="flex-[0_0_33%]">Name</div>
          <div className="flex-[0_0_25%]">Assigned</div>
          <div className="table-cell">Status</div>
          <div className=" flex gap-4">
            <div className="table-cell">Start</div>
            <div className="table-cell">Finish</div>
          </div>
        </div>
        {tasks.map((task) => {
          return <Task key={task.id} task={task} />;
        })}
        <button className="text-sm w-full py-2 border-b text-left text-muted-foreground">
          Add New +
        </button>
      </div>
    </>
  );
}

// export async function getServerSideProps(params) {

//   return { props: { project, tasks } };
// }
