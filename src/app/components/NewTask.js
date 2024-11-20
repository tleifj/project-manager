"use client";
import React, { useState } from "react";

import NewTaskModal from "./NewTaskModal";

export default function NewTask({ projectId, status }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <button
        onClick={openModal}
        className="text-sm w-full py-2 border-b text-left text-muted-foreground"
      >
        Add New Task +
      </button>
      <NewTaskModal
        projectId={projectId}
        isOpen={isModalOpen}
        onClose={closeModal}
        status={status}
      />
    </>
  );
}
