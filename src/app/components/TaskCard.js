import Link from "next/link";

export default function Task({ task }) {
  const formatDate = (date) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <article
      key={task.id}
      className="p-6 border border-solid border-gray rounded bg-white space-y-3"
    >
      <h1 className="text-lg font-semibold">{task.name}</h1>
      <div className="text-sm text-gray-600 space-y-1">
        <p>Start Date: {formatDate(task.startDate)}</p>
        <p>End Date: {formatDate(task.endDate)}</p>
      </div>
      <div className="text-sm">
        {task.users.map((user) => user.firstName + " " + user.lastName)}
      </div>
      <Link href="/task/[id]/edit" as={`/task/${task.id}/edit`}>
        <button className="text-sm text-blue-600 hover:text-blue-800">Edit</button>
      </Link>
    </article>
  );
}
