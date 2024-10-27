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

export default function NewTaskModal({ isOpen, onClose, projectId }) {
  const [taskName, setTaskName] = useState("");
  const [statusId, setStatusId] = useState("");
  const [statuses, setStatuses] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // get all statuses from supabase
    // fetch all statuses
    const fetchStatuses = async () => {
      try {
        const response = await fetch("/api/status/all");
        const data = await response.json();
        console.log(data.statuses);

        setStatuses(data.statuses);
      } catch (error) {
        console.error("Error fetching statuses:", error);
      }
    };

    fetchStatuses();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add logic to create a new task
    try {
      const body = {
        name: taskName,
        projectId,
        status: statusId.replace(/['"]+/g, ""),
      };
      await fetch("/api/task/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setForm({
        name: "",
        status: "",
      });
    } catch (error) {
      console.error(error);
    }
    onClose();
    router.refresh();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="Enter task name"
            required
          />

          <Select value={statusId} onValueChange={setStatusId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              {statuses &&
                statuses.map((status) => (
                  <SelectItem key={status.id} value={'"' + status.id + '"'}>
                    {status.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button type="submit">Create Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
