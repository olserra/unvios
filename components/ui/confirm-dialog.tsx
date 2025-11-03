"use client";

import React from "react";
import { Button } from "@/components/ui/button";

type ConfirmDialogProps = Readonly<{
  open: boolean;
  title?: string;
  description?: string;
  onClose: () => void;
  children?: React.ReactNode;
}>;

export default function ConfirmDialog({
  open,
  title = "Confirm",
  description,
  onClose,
  children,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative z-10 w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        {description && (
          <p className="text-sm text-gray-500 mt-2">{description}</p>
        )}
        <div className="mt-4">{children}</div>
        <div className="flex justify-end mt-4">
          <Button variant="ghost" onClick={onClose} className="mr-2">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
