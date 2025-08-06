"use client";

import React from "react";
import Modal from "@/components/common/Modal";
import CompanyForm from "./CompanyForm";
import { Company } from "@/types/company";

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company | null;
  onSave: (company: Omit<Company, "company_no" | "created_at" | "updated_at">) => void;
  saving?: boolean;
  defaultCompanyType?: string;
}

export default function CompanyModal({ 
  isOpen, 
  onClose, 
  company, 
  onSave, 
  saving,
  defaultCompanyType 
}: CompanyModalProps) {
  const handleSave = (companyData: Omit<Company, "company_no" | "created_at" | "updated_at">) => {
    onSave(companyData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={company ? "Edit Company" : "Add New Company"}
      size="lg"
    >
      <CompanyForm
        company={company}
        onSave={handleSave}
        onCancel={onClose}
        saving={saving}
        defaultCompanyType={defaultCompanyType}
      />
    </Modal>
  );
}
