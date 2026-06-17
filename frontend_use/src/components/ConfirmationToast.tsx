import React, { useEffect } from "react";

interface ConfirmationToastProps {
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
  onClose: () => void;
}

const ConfirmationToast: React.FC<ConfirmationToastProps> = ({
  message,
  type,
  duration = 3000,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
  };

  return (
    <div className={`fixed bottom-4 right-4 ${styles[type]} text-white shadow-lg rounded-lg p-4 z-50`}>
      <div className="flex items-center justify-between gap-4">
        <p>{message}</p>
        <button onClick={onClose} className="text-white font-bold text-lg">
          ✕
        </button>
      </div>
    </div>
  );
};

export default ConfirmationToast;