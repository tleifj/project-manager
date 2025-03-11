import { useState } from "react";
import TaskModal from "./TaskModal";

export default function Task({ task }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const formatDate = (date) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <article
        key={task.id}
        className="p-6 border border-solid border-gray rounded bg-white text-black space-y-3"
      >
        <h1 className="text-lg font-semibold">{task.name}</h1>
        <div className="text-sm text-gray-600 space-y-1">
          <p>Start Date: {formatDate(task.startDate)}</p>
          <p>End Date: {formatDate(task.endDate)}</p>
        </div>
        <div className="text-sm">
          {task.users.map((user) => user.firstName + " " + user.lastName)}
        </div>
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="text-blue-600 hover:text-blue-800"
        >
          Edit
        </button>
      </article>
      <TaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        projectId={task.projectId}
        taskId={task.id}
      />
    </>
  );
}
