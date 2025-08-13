"use client";

import React from "react";
import { Person } from "@/types/company";

interface PersonViewModalProps {
  isOpen: boolean;
  person: Person | null;
  onClose: () => void;
}

export default function PersonViewModal({ isOpen, person, onClose }: PersonViewModalProps) {
  if (!isOpen || !person) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-xl dark:bg-boxdark">
        <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-strokedark">
          <h3 className="text-lg font-semibold text-black dark:text-white">
            Person Details
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="text-md font-semibold text-black dark:text-white border-b border-stroke pb-2 dark:border-strokedark">
                Basic Information
              </h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                  Person ID
                </label>
                <p className="mt-1 text-black dark:text-white">{person.people_no}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                  First Name
                </label>
                <p className="mt-1 text-black dark:text-white">{person.first_name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                  Middle Name
                </label>
                <p className="mt-1 text-black dark:text-white">{person.middle_name || "-"}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                  Last Name
                </label>
                <p className="mt-1 text-black dark:text-white">{person.last_name}</p>
              </div>
            </div>

            {/* Status Information */}
            <div className="space-y-4">
              <h4 className="text-md font-semibold text-black dark:text-white border-b border-stroke pb-2 dark:border-strokedark">
                Status Information
              </h4>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                  Full Name
                </label>
                <p className="mt-1 text-black dark:text-white font-medium">
                  {person.first_name} {person.middle_name && `${person.middle_name} `}{person.last_name}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                  No Book Status
                </label>
                <span
                  className={`inline-flex mt-1 rounded-full px-3 py-1 text-sm font-medium ${
                    person.no_book
                      ? "bg-warning bg-opacity-10 text-warning"
                      : "bg-success bg-opacity-10 text-success"
                  }`}
                >
                  {person.no_book ? "No Book" : "In Book"}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                  Archive Status
                </label>
                <span
                  className={`inline-flex mt-1 rounded-full px-3 py-1 text-sm font-medium ${
                    person.archived
                      ? "bg-danger bg-opacity-10 text-danger"
                      : "bg-success bg-opacity-10 text-success"
                  }`}
                >
                  {person.archived ? "Archived" : "Active"}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end space-x-3 border-t border-stroke pt-6 dark:border-strokedark">
            <button
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
