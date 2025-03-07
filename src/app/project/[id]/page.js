import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import TasksInterface from "../../components/TasksInterface";
import Topbar from "../../components/Topbar";
import { log } from "console";

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
      <TasksInterface tasks={tasks} params={params} />
    </>
  );
}

// export async function getServerSideProps(params) {

//   return { props: { project, tasks } };
// }
