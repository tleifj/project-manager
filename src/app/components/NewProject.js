"use client";
import React, { useState } from "react";

import NewProjectModal from "./NewProjectModal";

export default function NewWorkspace({ workspaceId }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  return (
    <>
      <button
        onClick={openModal}
        className="text-sm w-full py-2 border-b text-left text-muted-foreground"
      >
        Add New Project +
      </button>
      <NewProjectModal
        workspaceId={workspaceId}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  );
}
