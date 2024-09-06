import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function WorkspaceListItem({ workspace }) {
  // Use useState to create toggles for the workspace project lists
  let [showProjects, setShowProjects] = useState(false);

  return (
    <div>
      <div
        onClick={() => setShowProjects(!showProjects)}
        className="flex justify-between items-center w-full cursor-pointer py-1"
      >
        <h2>{workspace.name}</h2>
        <span className="h-4 w-4 flex items-center justify-center">
          <ChevronRight className="max-w-full" />
        </span>
      </div>
      {showProjects && (
        <ul>
          {workspace.projects.map((project) => (
            <li key={project.id} className="ml-3 py-1">
              <Link href="/project/[id]" as={`/project/${project.id}`}>
                <h3>{project.name}</h3>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
