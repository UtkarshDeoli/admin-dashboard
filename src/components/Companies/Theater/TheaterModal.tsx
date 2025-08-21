"use client";

import React from "react";
import Modal from "@/components/common/Modal";
import { Theater } from "@/types/company";
import TheaterModalForm from "./TheaterModalForm";

interface TheaterModalProps {
  isOpen: boolean;
  onClose: () => void;
  theater: Theater | null;
  onSave: (theater: Omit<Theater, "theater_no">) => void;
  saving?: boolean;
}

export default function TheaterModal({ 
  isOpen, 
  onClose, 
  theater, 
  onSave, 
  saving
}: TheaterModalProps) {
  const handleSave = (theaterData: Omit<Theater, "theater_no">) => {
    onSave(theaterData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={theater ? "Edit Theater" : "Add New Theater"}
      size="xl"
    >
      <TheaterModalForm
        theater={theater}
        onSave={handleSave}
        onCancel={onClose}
        saving={saving}
      />
    </Modal>
  );
}
