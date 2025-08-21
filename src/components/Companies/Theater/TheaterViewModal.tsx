"use client";

import React from "react";
import Modal from "@/components/common/Modal";
import { Theater } from "@/types/company";

interface TheaterViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  theater: Theater | null;
  onEdit: (theater: Theater) => void;
  onDelete: (theaterNo: number) => void;
}

export default function TheaterViewModal({
  isOpen,
  onClose,
  theater,
  onEdit,
  onDelete
}: TheaterViewModalProps) {
  if (!theater) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Theater #${theater.theater_no}`}
      size="lg"
    >
      <div className="p-6.5">
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h6 className="mb-2 text-sm font-medium text-black dark:text-white">Company No</h6>
            <p className="text-sm text-gray-600 dark:text-gray-400">{theater.company_no}</p>
          </div>


          <div>
            <h6 className="mb-2 text-sm font-medium text-black dark:text-white">Submission Preference</h6>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {theater.submission_preference || "Not specified"}
            </p>
          </div>

          <div>
            <h6 className="mb-2 text-sm font-medium text-black dark:text-white">Literary Submission Preference</h6>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {theater.literary_submission_preference || "Not specified"}
            </p>
          </div>

          <div>
            <h6 className="mb-2 text-sm font-medium text-black dark:text-white">Contract</h6>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {theater.contract || "Not specified"}
            </p>
          </div>

          <div>
            <h6 className="mb-2 text-sm font-medium text-black dark:text-white">Production Company</h6>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {theater.production_compnay || "Not specified"}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h6 className="mb-2 text-sm font-medium text-black dark:text-white">Submission Preference</h6>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {theater.submission_preference || "Not specified"}
          </p>
        </div>

        

        {/* Age Ranges */}
        {/* <div className="mb-6">
          <h6 className="mb-4 text-sm font-medium text-black dark:text-white">Age Ranges</h6>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <p className="text-xs font-medium text-black dark:text-white">Represents Min Age</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{agency.represents_min_agee}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-black dark:text-white">Represents Max Age</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{agency.represents_max_age}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-black dark:text-white">Seeking Min Age</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{agency.seeking_min_age}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-black dark:text-white">Seeking Max Age</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{agency.seeking_max_age}</p>
            </div>
          </div>
        </div> */}

        {/* Agency Features */}
        <div className="mb-6">
          <h6 className="mb-4 text-sm font-medium text-black dark:text-white">Casting Features</h6>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
            <div className="flex items-center">
              <span className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-xs font-medium ${theater.production_compnay ? "bg-success text-success" : "bg-warning text-warning"
                }`}>
                Production Company: {theater.production_compnay ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex items-center">
              <span className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-xs font-medium ${theater.summer ? "bg-success text-success" : "bg-warning text-warning"
                }`}>
                Summer: {theater.summer ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex items-center">
              <span className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-xs font-medium ${theater.musical ? "bg-success text-success" : "bg-warning text-warning"
                }`}>
                Musical: {theater.musical ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex items-center">
              <span className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-xs font-medium ${theater.community ? "bg-success text-success" : "bg-warning text-warning"
                }`}>
                Community: {theater.community ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex items-center">
              <span className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-xs font-medium ${theater.outdoor ? "bg-success text-success" : "bg-warning text-warning"
                }`}>
                Outdoor: {theater.outdoor ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mb-6">
          <h6 className="mb-2 text-sm font-medium text-black dark:text-white">Status</h6>
          <span className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${theater.archived ? "bg-danger text-danger" : "bg-success text-success"
            }`}>
            {theater.archived ? "Archived" : "Active"}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => onEdit(theater)}
            className="flex items-center justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
          >
            Edit Agency
          </button>
          <button
            onClick={() => onDelete(theater.theater_no)}
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
