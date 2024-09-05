import useSWR from "swr";
import { PrismaClient } from "@prisma/client";
import WorkspaceListItem from "./WorkspaceListItem";

const prisma = new PrismaClient();

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const WorkspaceList = () => {
  // use useState to create toggles for the workspace project lists

  // Get the current task data
  const { data, error } = useSWR(`/api/workspace/all`, fetcher);
  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;
  return (
    <div>
      {/* Loop through each workspace and display the title. If the workspace has projects, display the projects underneath the workspace title */}
      {data.map((workspace) => (
        <WorkspaceListItem key={workspace.id} workspace={workspace} />
      ))}
    </div>
  );
};

export default WorkspaceList;
