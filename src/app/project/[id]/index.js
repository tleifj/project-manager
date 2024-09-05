import { PrismaClient } from "@prisma/client";
import Task from "../../../components/Task";
import Link from "next/link";
import Topbar from "../../../components/Topbar";

const prisma = new PrismaClient();

export default function SingleProject({ project, tasks }) {
  return (
    <>
      <Topbar name={project.name}></Topbar>
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
      </div>
      <Link href="/task/create" as={`/task/create`}>
        <button>Add Task</button>
      </Link>
    </>
  );
}

export async function getServerSideProps(params) {
  const project = await prisma.project.findUnique({
    where: {
      id: parseInt(params.query.id),
    },
  });
  project.createdAt = project.createdAt.toString();
  project.updatedAt = project.updatedAt.toString();

  const tasksResults = await prisma.task.findMany({
    where: {
      projectId: parseInt(params.query.id),
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

  return { props: { project, tasks } };
}
