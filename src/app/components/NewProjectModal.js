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

export default function NewProjectModal({ isOpen, onClose, workspaceId }) {
  const [projectName, setProjectName] = useState("");
  const [workspaces, setWorkspaces] = useState([]);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const response = await fetch("/api/workspace/all");
        const data = await response.json();
        console.log(data.workspaces);

        setWorkspaces(data.workspaces);
      } catch (error) {
        console.error("Error fetching workspaces:", error);
      }
    };

    fetchWorkspaces();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add logic to create a new task
    console.log("New project:", projectName, "in workspace:", workspaceId);
    // Get the form data

    // Send the form data to the API route
    e.preventDefault();
    try {
      const body = {
        name: projectName,
        workspaceId: workspaceId,
      };
      await fetch("/api/project/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setForm({
        name: "",
        description: "",
      });
      router.push("/");
    } catch (error) {
      console.error(error);
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name"
            required
          />

          <DialogFooter>
            <Button type="submit">Create Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
