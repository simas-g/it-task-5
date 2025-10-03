import { createPortal } from "react-dom";
import { X } from "lucide-react";

const TOAST_ROOT_ELEMENT = document.getElementById("toast-root");

export default function ToastContainer({ message, type, onClose }) {
  if (!message || !TOAST_ROOT_ELEMENT) return null;
  const baseClasses =
    "fixed bottom-5 right-5 p-4 rounded-lg shadow-lg flex items-center text-white font-semibold z-50 transition-transform duration-300";
  let colorClasses;
  switch (type) {
    case "success":
      colorClasses = "bg-green-500";
      break;
    case "error":
      colorClasses = "bg-red-600";
      break;
    default:
      colorClasses = "bg-gray-600";
  }
  const toastContent = (
    <div className={`${baseClasses} ${colorClasses}`}>
      <span>{message}</span>
      <X onClick={onClose} className="ml-4 font-bold h-5 w-5 cursor-pointer" />
    </div>
  );
  return createPortal(toastContent, TOAST_ROOT_ELEMENT);
}
