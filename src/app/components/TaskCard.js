import Link from "next/link";

export default function Task({ task }) {
  console.log(task);
  return (
    <article
      key={task.id}
      className="p-6 border border-solid border-gray rounded bg-white"
    >
      <h1>{task.name}</h1>{" "}
      {task.users.map((user) => user.firstName + " " + user.lastName)}
      <Link href="/task/[id]/edit" as={`/task/${task.id}/edit`}>
        <button>Edit</button>
      </Link>
    </article>
  );
}
