import React from "react";

interface AlertMessageProps {
  type?: "success" | "error" | "warning" | "info";
  message: string;
  onClose: () => void;
}

const typeStyles = {
  success: "bg-green-600 text-white",
  error: "bg-red-600 text-white",
  warning: "bg-yellow-500 text-black",
  info: "bg-blue-600 text-white",
};

export const AlertMessage: React.FC<AlertMessageProps> = ({
  type = "info",
  message,
  onClose,
}) => (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="absolute inset-0 bg-black bg-opacity-40" onClick={onClose} />
    <div className={`relative px-8 py-6 rounded-lg shadow-lg text-center min-w-[300px] max-w-[90vw] ${typeStyles[type]}`}>
      <span className="block text-lg font-semibold mb-2">{message}</span>
      <button
        className="mt-4 px-4 py-2 rounded bg-white text-gray-800 font-bold hover:bg-gray-200 transition"
        onClick={onClose}
      >
        Fechar
      </button>
    </div>
  </div>
); 