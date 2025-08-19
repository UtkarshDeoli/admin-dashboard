"use client";

import React from "react";
import Modal from "@/components/common/Modal";
import { Agency } from "@/types/company";

interface AgencyViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  agency: Agency | null;
  onEdit: (agency: Agency) => void;
  onDelete: (agencyNo: number) => void;
}

export default function AgencyViewModal({ 
  isOpen, 
  onClose, 
  agency, 
  onEdit, 
  onDelete 
}: AgencyViewModalProps) {
  if (!agency) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Agency #${agency.agency_no}`}
      size="lg"
    >
      <div className="p-6.5">
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h6 className="mb-2 text-sm font-medium text-black dark:text-white">Company No</h6>
            <p className="text-sm text-gray-600 dark:text-gray-400">{agency.company_no}</p>
          </div>

          <div>
            <h6 className="mb-2 text-sm font-medium text-black dark:text-white">Address No</h6>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {agency.address_no === 0 ? "No address assigned" : agency.address_no}
            </p>
          </div>

          <div>
            <h6 className="mb-2 text-sm font-medium text-black dark:text-white">Primary Contact</h6>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {agency.contact1 || "Not specified"}
            </p>
          </div>

          <div>
            <h6 className="mb-2 text-sm font-medium text-black dark:text-white">Secondary Contact</h6>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {agency.contact2 || "Not specified"}
            </p>
          </div>

          <div>
            <h6 className="mb-2 text-sm font-medium text-black dark:text-white">Unions</h6>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {agency.unions || "Not specified"}
            </p>
          </div>

          <div>
            <h6 className="mb-2 text-sm font-medium text-black dark:text-white">Market</h6>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {agency.market || "Not specified"}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h6 className="mb-2 text-sm font-medium text-black dark:text-white">Submission Preference</h6>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {agency.submission_preference || "Not specified"}
          </p>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h6 className="mb-2 text-sm font-medium text-black dark:text-white">Represents</h6>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {agency.represents || "Not specified"}
            </p>
          </div>

          <div>
            <h6 className="mb-2 text-sm font-medium text-black dark:text-white">Does Not Represent</h6>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {agency.does_not_represent || "Not specified"}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h6 className="mb-2 text-sm font-medium text-black dark:text-white">Seeks</h6>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {agency.seeks || "Not specified"}
          </p>
        </div>

        {/* Age Ranges */}
        <div className="mb-6">
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
        </div>

        {/* Agency Features */}
        <div className="mb-6">
          <h6 className="mb-4 text-sm font-medium text-black dark:text-white">Agency Features</h6>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
            <div className="flex items-center">
              <span className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-xs font-medium ${
                agency.literary_only ? "bg-success text-success" : "bg-warning text-warning"
              }`}>
                Literary Only: {agency.literary_only ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex items-center">
              <span className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-xs font-medium ${
                agency.bi_coastal ? "bg-success text-success" : "bg-warning text-warning"
              }`}>
                Bi-Coastal: {agency.bi_coastal ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex items-center">
              <span className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-xs font-medium ${
                agency.freelance ? "bg-success text-success" : "bg-warning text-warning"
              }`}>
                Freelance: {agency.freelance ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex items-center">
              <span className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-xs font-medium ${
                agency.talent ? "bg-success text-success" : "bg-warning text-warning"
              }`}>
                Talent: {agency.talent ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex items-center">
              <span className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-xs font-medium ${
                agency.seeking ? "bg-success text-success" : "bg-warning text-warning"
              }`}>
                Seeking: {agency.seeking ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mb-6">
          <h6 className="mb-2 text-sm font-medium text-black dark:text-white">Status</h6>
          <span className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
            agency.archived ? "bg-danger text-danger" : "bg-success text-success"
          }`}>
            {agency.archived ? "Archived" : "Active"}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => onEdit(agency)}
            className="flex items-center justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
          >
            Edit Agency
          </button>
          <button
            onClick={() => onDelete(agency.agency_no)}
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
