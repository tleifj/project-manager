import { PrismaClient } from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

export default function projectsPage({ projects }) {
  return (
    <div>
      <div className="page-header">
        <h1>Project</h1>
        <Link href="/project/create" as={`/project/create`}>
          <button>+ Create Project</button>
        </Link>
      </div>

      {projects.map((project) => (
        <Link
          key={project.id}
          href="/project/[id]"
          as={`/project/${project.id}`}
        >
          <a>
            <h2>{project.name}</h2>
            <p>{project.description}</p>
          </a>
        </Link>
      ))}
    </div>
  );
}

export async function getServerSideProps() {
  const results = await prisma.project.findMany({});
  // console.log(results);
  const projects = results.map((project) => {
    project.createdAt = project.createdAt.toString();
    project.updatedAt = project.updatedAt.toString();
    return project;
  });
  return { props: { projects: projects } };
}
