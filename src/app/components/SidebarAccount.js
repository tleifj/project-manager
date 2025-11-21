import { useState } from "react";
import NewTaskModal from "./NewTaskModal"; // Assume we'll create this component

export default function SidebarAccount() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="sidebar-account flex justify-between items-center">
      <div className="account-info flex justify-between items-center gap-4">
        <div className="avatar w-[24px] h-[24px] bg-gray-500 rounded-full ">
          {/* <img src="/avatar.jpg" alt="" /> */}
        </div>
        <div className="user-info">
          <p className="text-xs  mb-0">Visceral</p>
        </div>
      </div>
      <div className="account-action">
        <button onClick={openModal}>+</button>
      </div>
      <NewTaskModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}
