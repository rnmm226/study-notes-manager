"use client";

import { useEffect } from "react";
import Toast from "./Toast";

type ToastContainerProps = {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
};

export default function ToastContainer({
  message,
  type = "success",
  onClose,
}: ToastContainerProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3500);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) {
    return null;
  }

  return (
    <div className="fixed right-4 top-20 z-[100] sm:right-6">
      <Toast
        message={message}
        type={type}
        onClose={onClose}
      />
    </div>
  );
}