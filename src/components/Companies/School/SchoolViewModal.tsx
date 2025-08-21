"use client";

import React from "react";
import Modal from "@/components/common/Modal";
import { School } from "@/types/company";

interface SchoolViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  school: School | null;
  onEdit: (school: School) => void;
  onDelete: (schoolNo: number) => void;
}

export default function SchoolViewModal({ 
  isOpen, 
  onClose, 
  school, 
  onEdit, 
  onDelete 
}: SchoolViewModalProps) {
  if (!school) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`School #${school.school_no}`}
      size="lg"
    >
      <div className="p-6.5">
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h6 className="mb-2 text-sm font-medium text-black dark:text-white">Company No</h6>
            <p className="text-sm text-gray-600 dark:text-gray-400">{school.company_no}</p>
          </div>

          <div>
            <h6 className="mb-2 text-sm font-medium text-black dark:text-white">Policy</h6>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {school.policy || "Not specified"}
            </p>
          </div>

          <div>
            <h6 className="mb-2 text-sm font-medium text-black dark:text-white">Technique</h6>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {school.technique || "Not specified"}
            </p>
          </div>

          <div>
            <h6 className="mb-2 text-sm font-medium text-black dark:text-white">Audit</h6>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {school.audit || "Not specified"}
            </p>
          </div>

          <div>
            <h6 className="mb-2 text-sm font-medium text-black dark:text-white">Coaching</h6>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {school.coaching || "Not specified"}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h6 className="mb-2 text-sm font-medium text-black dark:text-white">Showcase</h6>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {school.showcase || "Not specified"}
          </p>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h6 className="mb-2 text-sm font-medium text-black dark:text-white">Bi-Coastal</h6>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {school.bi_coastal || "Not specified"}
            </p>
          </div>

          <div>
            <h6 className="mb-2 text-sm font-medium text-black dark:text-white">Online</h6>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {school.online || "Not specified"}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h6 className="mb-2 text-sm font-medium text-black dark:text-white">In-person</h6>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {school.in_person || "Not specified"}
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


        {/* Status */}
        <div className="mb-6">
          <h6 className="mb-2 text-sm font-medium text-black dark:text-white">Status</h6>
          <span className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
            school.archived ? "bg-danger text-danger" : "bg-success text-success"
          }`}>
            {school.archived ? "Archived" : "Active"}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => onEdit(school)}
            className="flex items-center justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
          >
            Edit Agency
          </button>
          <button
            onClick={() => onDelete(school.school_no)}
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
