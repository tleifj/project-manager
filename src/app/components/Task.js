import Link from "next/link";

export default function Task({ task, statuses }) {
  const formatDate = (date) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      key={task.id}
      className="flex w-full py-2 border-b justify-between text-sm gap-4 items-center"
    >
      <div className="flex-[0_0_25%]">{task.name}</div>
      <div className="flex-[0_0_20%]">
        {task.users
          .map((user) => `${user.firstName} ${user.lastName}`)
          .join(", ")}
      </div>
      <div className="flex-[0_0_15%]">
        {statuses.map((status) => {
          if (status.id === task.statusId) {
            return status.name;
          }
        })}
      </div>
      <div className="flex-[0_0_30%] flex gap-4">
        <div className="flex-1">{formatDate(task.startDate)}</div>
        <div className="flex-1">{formatDate(task.endDate)}</div>
      </div>
      <div className="flex-[0_0_10%]">
        <Link href="/task/[id]/edit" as={`/task/${task.id}/edit`}>
          <button className="text-blue-600 hover:text-blue-800">Edit</button>
        </Link>
      </div>
    </div>
  );
}
