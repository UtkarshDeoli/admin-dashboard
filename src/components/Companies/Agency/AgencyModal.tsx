"use client";

import React from "react";
import Modal from "@/components/common/Modal";
import AgencyModalForm from "./AgencyModalForm";
import { Agency } from "@/types/company";

interface AgencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  agency: Agency | null;
  onSave: (agency: Omit<Agency, "agency_no">) => void;
  saving?: boolean;
}

export default function AgencyModal({ 
  isOpen, 
  onClose, 
  agency, 
  onSave, 
  saving
}: AgencyModalProps) {
  const handleSave = (agencyData: Omit<Agency, "agency_no">) => {
    onSave(agencyData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={agency ? "Edit Agency" : "Add New Agency"}
      size="xl"
    >
      <AgencyModalForm
        agency={agency}
        onSave={handleSave}
        onCancel={onClose}
        saving={saving}
      />
    </Modal>
  );
}
