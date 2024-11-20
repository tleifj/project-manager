"use client";

import React, { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Task from "./Task";
import TaskCard from "./TaskCard";
import NewTask from "./NewTask";
import { List, Kanban } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function TasksInterface({ tasks, params, statuses }) {
  // create state for the toggle group
  const [view, setView] = useState("list");
  console.log(statuses);

  return (
    <>
      {" "}
      <div className="flex justify-end align-center">
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
      {/* show the following when view === list */}
      {view === "list" && (
        <div className="py-8">
          <div className="flex w-full py-2 border-b justify-between text-sm gap-4">
            <div className="flex-[0_0_33%]">Name</div>
            <div className="flex-[0_0_25%]">Assigned</div>
            <div className="table-cell">Status</div>
            <div className=" flex gap-4">
              <div className="table-cell">Start</div>
              <div className="table-cell">Finish</div>
            </div>
          </div>
          {tasks.map((task) => {
            return <Task key={task.id} task={task} />;
          })}
          <NewTask projectId={params.id} />
        </div>
      )}
      {/* show the following when view === kanban */}
      {view === "kanban" && (
        <DragDropContext>
          <div className="flex gap-4">
            {statuses.map((status) => {
              return (
                <Droppable key={status.id} droppableId={status.name}>
                  {(provided, snapshot) => (
                    <div
                      className="flex-[0_0_25%]"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      <h2>{status.name}</h2>
                      <div className="flex flex-col gap-4">
                        {tasks.map((task, index) => {
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
