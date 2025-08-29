"use client";

import React from "react";
import Modal from "@/components/common/Modal";
import { Casting } from "@/types/company";
import CastingModalForm from "./CastingModalForm";

interface CastingModalProps {
  isOpen: boolean;
  onClose: () => void;
  casting: Casting | null;
  onSave: (casting: Omit<Casting, "casting_company_no">) => void;
  saving?: boolean;
}

export default function CastingModal({ 
  isOpen, 
  onClose, 
  casting, 
  onSave, 
  saving
}: CastingModalProps) {
  const handleSave = (castingData: Omit<Casting, "casting_company_no">) => {
    onSave(castingData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={casting ? "Edit Casting" : "Add New Casting"}
      size="xl"
    >
      <CastingModalForm
        casting={casting}
        onSave={handleSave}
        onCancel={onClose}
        saving={saving}
      />
    </Modal>
  );
}
