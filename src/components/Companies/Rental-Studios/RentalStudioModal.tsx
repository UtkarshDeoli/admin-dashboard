"use client";

import React from "react";
import Modal from "@/components/common/Modal";
import { RentalStudio } from "@/types/company";
import RentalStudioModalForm from "./RentalStudioModalForm";

interface RentalStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  rentalStudio: RentalStudio | null;
  onSave: (rentalStudio: Omit<RentalStudio, "studio_no">) => void;
  saving?: boolean;
}

export default function RentalStudioModal({ 
  isOpen, 
  onClose, 
  rentalStudio, 
  onSave, 
  saving
}: RentalStudioModalProps) {
  const handleSave = (rentalStudioData: Omit<RentalStudio, "studio_no">) => {
    onSave(rentalStudioData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={rentalStudio ? "Edit Rental Space" : "Add New Rental Space"}
      size="xl"
    >
      <RentalStudioModalForm
        rentalStudio={rentalStudio}
        onSave={handleSave}
        onCancel={onClose}
        saving={saving}
      />
    </Modal>
  );
}
