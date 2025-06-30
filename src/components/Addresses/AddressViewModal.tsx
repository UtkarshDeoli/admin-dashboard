"use client";

import React from "react";
import Modal from "@/components/common/Modal";
import { Address } from "@/types/company";

interface AddressViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: Address | null;
  onEdit: (address: Address) => void;
  onDelete: (addressNo: number) => void;
}

export default function AddressViewModal({ isOpen, onClose, address, onEdit, onDelete }: AddressViewModalProps) {
  if (!address) return null;

  const handleEdit = () => {
    onEdit(address);
    onClose();
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this address?')) {
      onDelete(address.address_no);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Address Details"
      size="md"
    >
      <div className="p-6.5">
        <div className="space-y-4">
          {/* Address Lines */}
          <div>
            <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
              Address
            </label>
            <div className="text-black dark:text-white">
              <div>{address.line1}</div>
              {address.line2 && <div>{address.line2}</div>}
              {address.line3 && <div>{address.line3}</div>}
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div>
              <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
                City
              </label>
              <p className="text-black dark:text-white">{address.city}</p>
            </div>
            <div>
              <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
                State
              </label>
              <p className="text-black dark:text-white">{address.state}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div>
              <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
                ZIP Code
              </label>
              <p className="text-black dark:text-white">{address.zip}</p>
            </div>
            <div>
              <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
                Country
              </label>
              <p className="text-black dark:text-white">{address.country}</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div>
              <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
                Primary Phone
              </label>
              <p className="text-black dark:text-white">{address.phone1 || "N/A"}</p>
            </div>
            <div>
              <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
                Secondary Phone
              </label>
              <p className="text-black dark:text-white">{address.phone2 || "N/A"}</p>
            </div>
          </div>

          {address.phone3 && (
            <div>
              <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
                Third Phone
              </label>
              <p className="text-black dark:text-white">{address.phone3}</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div>
              <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
                Primary Email
              </label>
              <p className="text-black dark:text-white">{address.email1 || "N/A"}</p>
            </div>
            <div>
              <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
                Secondary Email
              </label>
              <p className="text-black dark:text-white">{address.email2 || "N/A"}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div>
              <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
                Primary Website
              </label>
              <p className="text-black dark:text-white">{address.website1 || "N/A"}</p>
            </div>
            <div>
              <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
                Secondary Website
              </label>
              <p className="text-black dark:text-white">{address.website2 || "N/A"}</p>
            </div>
          </div>

          {address.fax && (
            <div>
              <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
                Fax
              </label>
              <p className="text-black dark:text-white">{address.fax}</p>
            </div>
          )}

          {/* Verification Status */}
          <div>
            <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
              Verification Status
            </label>
            <span
              className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                address.verified
                  ? "bg-success bg-opacity-10 text-success"
                  : "bg-warning bg-opacity-10 text-warning"
              }`}
            >
              {address.verified ? "Verified" : "Unverified"}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={handleEdit}
            className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
          >
            Edit Address
          </button>
          <button
            onClick={handleDelete}
            className="flex justify-center rounded bg-danger px-6 py-2 font-medium text-white hover:bg-opacity-90"
          >
            Delete Address
          </button>
          <button
            onClick={onClose}
            className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
