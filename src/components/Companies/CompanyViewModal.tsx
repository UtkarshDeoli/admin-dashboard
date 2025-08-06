"use client";

import React from "react";
import Modal from "@/components/common/Modal";
import { Company } from "@/types/company";

interface CompanyViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company | null;
  onEdit: (company: Company) => void;
  onDelete: (companyNo: number) => void;
}

export default function CompanyViewModal({
  isOpen,
  onClose,
  company,
  onEdit,
  onDelete
}: CompanyViewModalProps) {
  if (!company) return null;

  const handleEdit = () => {
    onEdit(company);
    onClose();
  };

  const handleDelete = () => {
    onDelete(company.company_no);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Company Details"
      size="lg"
    >
      <div className="p-6.5">
        {/* Company Information */}
        <div className="mb-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Company Name
              </label>
              <p className="text-black dark:text-white font-semibold">
                {company.name}
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Company Type
              </label>
              <span className="inline-flex rounded-full px-3 py-1 text-sm font-medium bg-gray-100 bg-opacity-10 text-gray-600 dark:text-gray-400">
                Dynamic
              </span>
            </div>

            {company.acronym && (
              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  Acronym
                </label>
                <p className="text-black dark:text-white">
                  {company.acronym}
                </p>
              </div>
            )}

            {company.fka && (
              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  Formerly Known As
                </label>
                <p className="text-black dark:text-white">
                  {company.fka}
                </p>
              </div>
            )}
          </div>

          {company.description && (
            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Description
              </label>
              <p className="text-black dark:text-white">
                {company.description}
              </p>
            </div>
          )}
        </div>

        {/* Status Information */}
        <div className="mb-6">
          <h6 className="mb-4 text-lg font-semibold text-black dark:text-white">
            Status
          </h6>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Verification Status
              </label>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                  company.verified
                    ? "bg-success bg-opacity-10 text-success"
                    : "bg-warning bg-opacity-10 text-warning"
                }`}
              >
                {company.verified ? "Verified" : "Unverified"}
              </span>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Archive Status
              </label>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                  company.archived
                    ? "bg-danger bg-opacity-10 text-danger"
                    : "bg-success bg-opacity-10 text-success"
                }`}
              >
                {company.archived ? "Archived" : "Active"}
              </span>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Company ID
              </label>
              <p className="text-black dark:text-white font-mono">
                #{company.company_no}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:border-black dark:border-strokedark dark:text-white dark:hover:border-white"
          >
            Close
          </button>
          
          <button
            onClick={handleEdit}
            className="flex items-center justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
          >
            Edit Company
          </button>
          
          <button
            onClick={handleDelete}
            className="flex items-center justify-center rounded bg-danger px-6 py-2 font-medium text-white hover:bg-opacity-90"
          >
            Delete Company
          </button>
        </div>
      </div>
    </Modal>
  );
}
