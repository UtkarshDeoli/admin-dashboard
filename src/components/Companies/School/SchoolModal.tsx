"use client";

import React from "react";
import Modal from "@/components/common/Modal";
import { School } from "@/types/company";
import SchoolModalForm from "./SchoolModalForm";

interface SchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  school: School | null;
  onSave: (school: Omit<School, "school_no">) => void;
  saving?: boolean;
}

export default function SchoolModal({ 
  isOpen, 
  onClose, 
  school, 
  onSave, 
  saving
}: SchoolModalProps) {
  const handleSave = (schoolData: Omit<School, "school_no">) => {
    onSave(schoolData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={school ? "Edit School" : "Add New School"}
      size="xl"
    >
      <SchoolModalForm
        school={school}
        onSave={handleSave}
        onCancel={onClose}
        saving={saving}
      />
    </Modal>
  );
}
