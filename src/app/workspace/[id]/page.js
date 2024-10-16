import { PrismaClient } from "@prisma/client";
import Task from "../../components/Task";
import Link from "next/link";
import Topbar from "../../components/Topbar";
import NewProject from "../../components/NewProject";
import { use } from "react";
const prisma = new PrismaClient();

export default async function SingleWorkspace({ params }) {
  console.log(params.id);
  const workspace = await prisma.workspace.findUnique({
    where: {
      id: parseInt(params.id),
    },
  });
  console.log(workspace);
  if (workspace) {
    workspace.createdAt = workspace.createdAt.toString();
    workspace.updatedAt = workspace.updatedAt.toString();
  }

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
        {/* {tasks.map((task) => {
          return <Task key={task.id} task={task} />;
        })} */}
        {/* Pass the current workspace id to NewProject */}

        <NewProject workspaceId={params.id} />
      </div>
    </>
  );
}

// export async function getServerSideProps(params) {

//   return { props: { project, tasks } };
// }
