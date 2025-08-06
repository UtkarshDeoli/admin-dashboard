"use client";

import { useState, useCallback } from "react";

interface UseConfirmationOptions {
  title?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

interface ConfirmationState {
  isOpen: boolean;
  message: string;
  title: string;
  confirmText: string;
  cancelText: string;
  variant: "danger" | "warning" | "info";
  onConfirm: (() => void) | null;
}

export function useConfirmation() {
  const [state, setState] = useState<ConfirmationState>({
    isOpen: false,
    message: "",
    title: "Confirm Action",
    confirmText: "Confirm",
    cancelText: "Cancel",
    variant: "danger",
    onConfirm: null,
  });

  const confirm = useCallback(
    (message: string, options?: UseConfirmationOptions): Promise<boolean> => {
      return new Promise((resolve) => {
        setState({
          isOpen: true,
          message,
          title: options?.title || "Confirm Action",
          confirmText: options?.confirmText || "Confirm",
          cancelText: options?.cancelText || "Cancel",
          variant: options?.variant || "danger",
          onConfirm: () => {
            setState(prev => ({ ...prev, isOpen: false }));
            resolve(true);
          },
        });
      });
    },
    []
  );

  const handleCancel = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const confirmationProps = {
    isOpen: state.isOpen,
    message: state.message,
    title: state.title,
    confirmText: state.confirmText,
    cancelText: state.cancelText,
    variant: state.variant,
    onConfirm: state.onConfirm || (() => {}),
    onCancel: handleCancel,
  };

  return {
    confirm,
    confirmationProps,
  };
}
