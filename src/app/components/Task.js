"use client";

import { useState } from "react";
import { useProjectContext } from "../context/ProjectContext";
import TaskModal from "./TaskModal";
import { useRouter } from "next/navigation";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../../components/ui/popover";

export default function Task({ task }) {
  const { statuses, users } = useProjectContext();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState("");
  const router = useRouter();

  const formatDate = (date) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleSave = async (field, value) => {
    try {
      // Only send the field being updated
      const updateData = {};
      switch (field) {
        case "name":
          updateData.name = value;
          break;
        case "users":
          updateData.userIds = value;
          break;
        case "status":
          updateData.status = value;
          break;
        case "startDate":
        case "endDate":
          updateData[field] = value || null;
          break;
      }

      const response = await fetch(`/api/task/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to update task: ${
            errorData.details || errorData.error || response.statusText
          }`
        );
      }

      setEditingField(null);
      router.refresh();
    } catch (error) {
      console.error("Error updating task:", error);
      alert(error.message);
    }
  };

  return (
    <>
      <div
        key={task.id}
        className="flex w-full py-2 border-b justify-between text-sm gap-4 items-center"
      >
        <div className="flex-[0_0_25%]">
          {editingField === "name" ? (
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={() => handleSave("name", editValue)}
              onKeyDown={(e) =>
                e.key === "Enter" && handleSave("name", editValue)
              }
              className="py-0 text-sm"
              autoFocus
            />
          ) : (
            <span
              onClick={() => {
                setEditingField("name");
                setEditValue(task.name);
              }}
              className="cursor-pointer hover:text-blue-600"
            >
              {task.name}
            </span>
          )}
        </div>

        <div className="flex-[0_0_20%]">
          <Popover
            open={editingField === "users"}
            onOpenChange={(open) => !open && setEditingField(null)}
          >
            <PopoverTrigger asChild>
              <span className="cursor-pointer hover:text-blue-600">
                {task.users
                  .map((user) => `${user.firstName} ${user.lastName}`)
                  .join(", ")}
              </span>
            </PopoverTrigger>
            <PopoverContent className="w-60">
              <div className="space-y-2">
                {users.map((user) => (
                  <label key={user.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={task.users.some((u) => u.id === user.id)}
                      onChange={(e) => {
                        const newUserIds = e.target.checked
                          ? [...task.users.map((u) => u.id), user.id]
                          : task.users
                              .map((u) => u.id)
                              .filter((id) => id !== user.id);
                        handleSave("users", newUserIds);
                      }}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <span>
                      {user.firstName} {user.lastName}
                    </span>
                  </label>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex-[0_0_15%]">
          <Select
            value={task.statusId.toString()}
            onValueChange={(value) => handleSave("status", value)}
          >
            <SelectTrigger className="h-auto py-1 w-full">
              <SelectValue>
                {statuses.find((s) => s.id === task.statusId)?.name}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status.id} value={status.id.toString()}>
                  {status.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-[0_0_30%] flex gap-4">
          <div className="flex-1">
            {editingField === "startDate" ? (
              <Input
                type="datetime-local"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => handleSave("startDate", editValue)}
                className="py-0 text-sm"
                autoFocus
              />
            ) : (
              <span
                onClick={() => {
                  setEditingField("startDate");
                  setEditValue(
                    task.startDate
                      ? new Date(task.startDate).toISOString().slice(0, 16)
                      : ""
                  );
                }}
                className="cursor-pointer hover:text-blue-600"
              >
                {formatDate(task.startDate)}
              </span>
            )}
          </div>
          <div className="flex-1">
            {editingField === "endDate" ? (
              <Input
                type="datetime-local"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => handleSave("endDate", editValue)}
                className="py-0 text-sm"
                autoFocus
              />
            ) : (
              <span
                onClick={() => {
                  setEditingField("endDate");
                  setEditValue(
                    task.endDate
                      ? new Date(task.endDate).toISOString().slice(0, 16)
                      : ""
                  );
                }}
                className="cursor-pointer hover:text-blue-600"
              >
                {formatDate(task.endDate)}
              </span>
            )}
          </div>
        </div>

        <div className="flex-[0_0_10%]">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="text-blue-600 hover:text-blue-800"
          >
            Edit All
          </button>
        </div>
      </div>

      <TaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        projectId={task.projectId}
        taskId={task.id}
      />
    </>
  );
}
