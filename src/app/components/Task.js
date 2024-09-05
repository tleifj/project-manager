import styled from "styled-components";
import Link from "next/link";

export default function Task({ task }) {
  console.log(task);
  return (
    <div
      key={task.id}
      className="flex w-full py-2 border-b  justify-between text-sm gap-4"
    >
      <div className="flex-[0_0_33%]">{task.name}</div>
      <div className="flex-[0_0_25%]">
        {" "}
        {task.users.map((user) => user.firstName + " " + user.lastName)}
      </div>
      <div className="table-cell">Status</div>
      <div className=" flex gap-4">
        <div className="table-cell">Start</div>
        <div className="table-cell">Finish</div>
      </div>
      <Link href="/task/[id]/edit" as={`/task/${task.id}/edit`}>
        <button>Edit</button>
      </Link>
    </div>
  );
}
