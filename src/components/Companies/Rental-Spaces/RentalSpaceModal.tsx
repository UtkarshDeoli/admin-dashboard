"use client";

import React from "react";
import Modal from "@/components/common/Modal";
import { RentalSpace } from "@/types/company";
import RentalSpaceModalForm from "./RentalSpaceModalForm";

interface CastingModalProps {
  isOpen: boolean;
  onClose: () => void;
  rentalSpaces: RentalSpace | null;
  onSave: (rentalSpace: Omit<RentalSpace, "space_no">) => void;
  saving?: boolean;
}

export default function RentalSpaceModal({ 
  isOpen, 
  onClose, 
  rentalSpaces, 
  onSave, 
  saving
}: CastingModalProps) {
  const handleSave = (rentalSpaceData: Omit<RentalSpace, "space_no">) => {
    onSave(rentalSpaceData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={rentalSpaces ? "Edit Rental Space" : "Add New Rental Space"}
      size="xl"
    >
      <RentalSpaceModalForm
        rentalSpace={rentalSpaces}
        onSave={handleSave}
        onCancel={onClose}
        saving={saving}
      />
    </Modal>
  );
}
