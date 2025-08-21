"use client";

import React from "react";
import Modal from "@/components/common/Modal";
import { RentalSpace } from "@/types/company";

interface RentalSpaceViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  rentalSpace: RentalSpace | null;
  onEdit: (rentalSpace: RentalSpace) => void;
  onDelete: (rentalSpaceNo: number) => void;
}

export default function RentalSpaceViewModal({ 
  isOpen, 
  onClose, 
  rentalSpace, 
  onEdit, 
  onDelete 
}: RentalSpaceViewModalProps) {
  if (!rentalSpace) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Agency #${rentalSpace.space_no}`}
      size="lg"
    >
      <div className="p-6.5">
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h6 className="mb-2 text-sm font-medium text-black dark:text-white">Company No</h6>
            <p className="text-sm text-gray-600 dark:text-gray-400">{rentalSpace.company_no}</p>
          </div>

          <div>
            <h6 className="mb-2 text-sm font-medium text-black dark:text-white">Address No</h6>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {rentalSpace.address_no === 0 ? "No address assigned" : rentalSpace.address_no}
            </p>
          </div>

          <div>
            <h6 className="mb-2 text-sm font-medium text-black dark:text-white">Name</h6>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {rentalSpace.name || "Not specified"}
            </p>
          </div>

          <div>
            <h6 className="mb-2 text-sm font-medium text-black dark:text-white">Dimensions</h6>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {rentalSpace.dimensions || "Not specified"}
            </p>
          </div>

          <div>
            <h6 className="mb-2 text-sm font-medium text-black dark:text-white">Seats</h6>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {rentalSpace.seats || "Not specified"}
            </p>
          </div>

          <div>
            <h6 className="mb-2 text-sm font-medium text-black dark:text-white">Seats Type</h6>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {rentalSpace.space_type || "Not specified"}
            </p>
          </div>
        </div>


        {/* Status */}
        <div className="mb-6">
          <h6 className="mb-2 text-sm font-medium text-black dark:text-white">Status</h6>
          <span className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
            rentalSpace.archived ? "bg-danger text-danger" : "bg-success text-success"
          }`}>
            {rentalSpace.archived ? "Archived" : "Active"}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => onEdit(rentalSpace)}
            className="flex items-center justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
          >
            Edit Agency
          </button>
          <button
            onClick={() => onDelete(rentalSpace.space_no)}
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
