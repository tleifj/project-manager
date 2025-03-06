"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

export default function TaskModal({
  isOpen,
  onClose,
  projectId,
  status,
  taskId,
}) {
  const [taskName, setTaskName] = useState("");
  const [statusId, setStatusId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statuses, setStatuses] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch statuses
        const statusResponse = await fetch("/api/status/all");
        const statusData = await statusResponse.json();
        setStatuses(statusData.statuses);

        // Fetch users
        const userResponse = await fetch("/api/user/all");
        const userData = await userResponse.json();
        setUsers(userData.users);

        // If editing existing task, fetch task data
        if (taskId) {
          const taskResponse = await fetch(`/api/task/${taskId}`);
          const taskData = await taskResponse.json();

          setTaskName(taskData.name);
          setStatusId(taskData.statusId.toString());
          setStartDate(
            taskData.startDate
              ? new Date(taskData.startDate).toISOString().slice(0, 16)
              : ""
          );
          setEndDate(
            taskData.endDate
              ? new Date(taskData.endDate).toISOString().slice(0, 16)
              : ""
          );
          setSelectedUsers(taskData.users.map((user) => user.id));
        } else {
          // For new task, set initial status if provided
          setStatusId((status && status.id.toString()) || "");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [taskId, status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = {
        name: taskName,
        projectId,
        startDate: startDate || null,
        endDate: endDate || null,
        userIds: selectedUsers,
        status: statusId.replace(/['"]+/g, ""),
      };

      const url = taskId ? `/api/task/${taskId}` : "/api/task/new";
      const method = taskId ? "PUT" : "POST";

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      setTaskName("");
      setStartDate("");
      setEndDate("");
      setStatusId("");
      setSelectedUsers([]);
      onClose();
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle className="text-gray-900">
            {taskId ? "Edit Task" : "Create New Task"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 text-gray-900">
          <Input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="Enter task name"
            className="text-gray-900"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="startDate"
                className="text-sm text-gray-900 font-medium"
              >
                Start Date
              </label>
              <Input
                type="datetime-local"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="text-gray-900"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="endDate"
                className="text-sm text-gray-900 font-medium"
              >
                End Date
              </label>
              <Input
                type="datetime-local"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                className="text-gray-900"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Assign Users</label>
            <div className="border rounded-md p-4 space-y-2 max-h-48 overflow-y-auto">
              {users.map((user) => (
                <div key={user.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`user-${user.id}`}
                    checked={selectedUsers.includes(user.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers([...selectedUsers, user.id]);
                      } else {
                        setSelectedUsers(
                          selectedUsers.filter((id) => id !== user.id)
                        );
                      }
                    }}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label
                    htmlFor={`user-${user.id}`}
                    className="text-sm text-gray-900"
                  >
                    {user.firstName} {user.lastName}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Select
            value={statusId}
            onValueChange={setStatusId}
            className="text-gray-900"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent className="text-gray-900">
              {statuses &&
                statuses.map((status) => (
                  <SelectItem
                    key={status.id}
                    value={status.id.toString()}
                    className="text-gray-900"
                  >
                    {status.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button type="submit">{taskId ? "Update" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
