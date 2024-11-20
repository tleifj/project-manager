import Link from "next/link";

export default function Task({ task }) {
  console.log(task);
  return (
    <article
      key={task.id}
      className="p-4 border border-solid border-gray rounded"
    >
      <h1>{task.name}</h1>{" "}
      {task.users.map((user) => user.firstName + " " + user.lastName)}
      <Link href="/task/[id]/edit" as={`/task/${task.id}/edit`}>
        <button>Edit</button>
      </Link>
    </article>
  );
}
