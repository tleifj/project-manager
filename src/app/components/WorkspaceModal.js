// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "../components/ui/dialog";
import { X } from "lucide-react";
import NewWorkspace from "./NewWorkspace";

export default function Modal({ showModal, setShowModal }) {
  // When a user clicks the x icon, the modal should close
  if (showModal) {
    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity flex items-center justify-center">
        <div className="py-10 px-8 relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <X
            onClick={() => setShowModal(false)}
            className="h-4 w-4 absolute top-6 right-6"
          />

          <NewWorkspace showModal={showModal} setShowModal={setShowModal} />
        </div>
      </div>
    );
  } else {
    return null;
  }
}
