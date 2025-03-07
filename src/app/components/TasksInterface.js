"use client";

import React, { useState, useEffect } from "react";
import { useProjectContext } from "../context/ProjectContext";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Task from "./Task";
import TaskCard from "./TaskCard";
import NewTask from "./NewTask";
import { List, Kanban } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useRouter } from "next/navigation";

export default function TasksInterface({ tasks, params }) {
  const { statuses, isLoading } = useProjectContext();
  const [localTasks, setLocalTasks] = useState(tasks);
  const [view, setView] = useState("list");
  const router = useRouter();

  // Update localTasks when tasks prop changes
  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  return (
    <>
      {" "}
      <div className="flex justify-end align-center py-4">
        <ToggleGroup type="single">
          {/* Set toggle item to active if view === list */}
          <ToggleGroupItem
            value="list"
            onClick={() => setView("list")}
            data-state={view === "list" ? "on" : "off"}
          >
            <List className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="kanban"
            onClick={() => setView("kanban")}
            data-state={view === "kanban" ? "on" : "off"}
          >
            <Kanban className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      {isLoading ? (
        <div className="py-8 text-center text-gray-500">Loading...</div>
      ) : (
        view === "list" && (
          <div className="py-8">
            <div className="flex w-full py-2 border-b justify-between text-sm gap-4">
              <div className="flex-[0_0_25%]">Name</div>
              <div className="flex-[0_0_20%]">Assigned</div>
              <div className="table-cell flex-[0_0_15%]">Status</div>
              <div className=" flex flex-[0_0_30%] flex gap-4">
                <div className="flex-1 table-cell">Start</div>
                <div className="flex-1 table-cell">Finish</div>
              </div>
              <div className="flex-[0_0_10%]"></div>
            </div>
            {localTasks.map((task) => {
              return <Task key={task.id} task={task} />;
            })}
            <NewTask projectId={params.id} />
          </div>
        )
      )}
      {/* show the following when view === kanban */}
      {view === "kanban" && (
        <DragDropContext
          onDragEnd={async (result) => {
            if (!result.destination) return;

            const sourceStatus = statuses.find(
              (s) => s.name === result.source.droppableId
            );
            const destStatus = statuses.find(
              (s) => s.name === result.destination.droppableId
            );
            const taskId = parseInt(result.draggableId);

            if (sourceStatus.id === destStatus.id) return;

            try {
              // Optimistically update the UI
              const updatedTasks = localTasks.map((task) => {
                if (task.id === taskId) {
                  return { ...task, statusId: destStatus.id };
                }
                return task;
              });
              setLocalTasks(updatedTasks);

              // Get the task that's being moved
              const taskToUpdate = localTasks.find(t => t.id === taskId);
              
              // Update the backend
              await fetch(`/api/task/${taskId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: taskToUpdate.name,
                  projectId: taskToUpdate.projectId,
                  startDate: taskToUpdate.startDate,
                  endDate: taskToUpdate.endDate,
                  userIds: taskToUpdate.users.map(user => user.id),
                  status: destStatus.id.toString(),
                }),
              });

              router.refresh();
            } catch (error) {
              console.error("Error updating task status:", error);
              // Revert the optimistic update on error
              setLocalTasks(tasks);
            }
          }}
        >
          <div className="flex gap-4">
            {statuses.map((status) => {
              return (
                <Droppable key={status.id} droppableId={status.name}>
                  {(provided, snapshot) => (
                    <div
                      className={`flex-[0_0_25%] status-${status.id} py-4 px-2 rounded`}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      <h2 className="font-bold">{status.name}</h2>
                      <div className="flex flex-col gap-4">
                        {localTasks.map((task, index) => {
                          if (task.statusId !== status.id) return null;
                          return (
                            <Draggable
                              key={task.id}
                              draggableId={task.id.toString()}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  key={task.id}
                                  provided={provided}
                                  snapshot={snapshot}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <TaskCard task={task} />
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        <NewTask projectId={params.id} status={status} />
                      </div>
                    </div>
                  )}
                </Droppable>
              );
            })}
          </div>
        </DragDropContext>
      )}
    </>
  );
}
