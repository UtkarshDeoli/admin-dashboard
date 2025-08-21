"use client";

import React from "react";
import Modal from "@/components/common/Modal";
import { RentalStudio } from "@/types/company";

interface RentalStudioViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  rentalStudio: RentalStudio | null;
  onEdit: (rentalStudio: RentalStudio) => void;
  onDelete: (rentalStudioNo: number) => void;
}

export default function RentalStudioViewModal({ 
  isOpen, 
  onClose, 
  rentalStudio, 
  onEdit, 
  onDelete 
}: RentalStudioViewModalProps) {
  if (!rentalStudio) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Agency #${rentalStudio.studio_no}`}
      size="lg"
    >
      <div className="p-6.5">
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h6 className="mb-2 text-sm font-medium text-black dark:text-white">Company No</h6>
            <p className="text-sm text-gray-600 dark:text-gray-400">{rentalStudio.company_no}</p>
          </div>

          <div>
            <h6 className="mb-2 text-sm font-medium text-black dark:text-white">Address No</h6>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {rentalStudio.address_no === 0 ? "No address assigned" : rentalStudio.address_no}
            </p>
          </div>

          <div>
            <h6 className="mb-2 text-sm font-medium text-black dark:text-white">Name</h6>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {rentalStudio.name || "Not specified"}
            </p>
          </div>

          <div>
            <h6 className="mb-2 text-sm font-medium text-black dark:text-white">Num of Studios</h6>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {rentalStudio.num_studios || "Not specified"}
            </p>
          </div>

          <div>
            <h6 className="mb-2 text-sm font-medium text-black dark:text-white">Rate</h6>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {rentalStudio.rate || "Not specified"}
            </p>
          </div>

          <div>
            <h6 className="mb-2 text-sm font-medium text-black dark:text-white">Rate Frequency</h6>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {rentalStudio.rate_frequency || "Not specified"}
            </p>
          </div>
        </div>


        {/* Status */}
        <div className="mb-6">
          <h6 className="mb-2 text-sm font-medium text-black dark:text-white">Status</h6>
          <span className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
            rentalStudio.archived ? "bg-danger text-danger" : "bg-success text-success"
          }`}>
            {rentalStudio.archived ? "Archived" : "Active"}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => onEdit(rentalStudio)}
            className="flex items-center justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
          >
            Edit Agency
          </button>
          <button
            onClick={() => onDelete(rentalStudio.studio_no)}
            className="flex items-center justify-center rounded bg-danger px-6 py-2 font-medium text-white hover:bg-opacity-90"
          >
            Delete Agency
          </button>
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:border-black dark:border-strokedark dark:text-white dark:hover:border-white"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
