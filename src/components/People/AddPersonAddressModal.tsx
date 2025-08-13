"use client";

import React, { useState } from "react";
import { Address } from "@/types/company";

interface AddPersonAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  addresses: Address[];
  onAdd: (addressId: number) => Promise<void>;
  saving: boolean;
}

export default function AddPersonAddressModal({
  isOpen,
  onClose,
  addresses,
  onAdd,
  saving
}: AddPersonAddressModalProps) {
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAddressId) {
      await onAdd(selectedAddressId);
      setSelectedAddressId(null);
      setSearchTerm("");
    }
  };

  const handleClose = () => {
    setSelectedAddressId(null);
    setSearchTerm("");
    onClose();
  };

  const filteredAddresses = addresses.filter(address =>
    address.line1.toLowerCase().includes(searchTerm.toLowerCase()) ||
    address.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    address.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
    address.email1?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-999999 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-black bg-opacity-50">
      <div className="relative w-auto max-w-3xl mx-auto my-6">
        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none dark:bg-boxdark">
          {/* Header */}
          <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-stroke dark:border-strokedark">
            <h3 className="text-xl font-semibold text-black dark:text-white">
              Add Existing Address to Person
            </h3>
            <button
              className="float-right p-1 ml-auto text-3xl font-semibold leading-none text-black bg-transparent border-0 outline-none focus:outline-none dark:text-white"
              onClick={handleClose}
            >
              ×
            </button>
          </div>
          
          {/* Body */}
          <div className="relative flex-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Search */}
              <div>
                <label className="mb-2.5 block text-black dark:text-white">
                  Search Addresses
                </label>
                <input
                  type="text"
                  placeholder="Search by address, city, state, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              {/* Address Selection */}
              <div className="max-h-64 overflow-y-auto border border-stroke rounded dark:border-strokedark">
                {filteredAddresses.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    No available addresses found
                  </div>
                ) : (
                  filteredAddresses.map((address) => (
                    <div
                      key={address.address_no}
                      className={`p-3 border-b border-stroke cursor-pointer hover:bg-gray-50 dark:border-strokedark dark:hover:bg-gray-800 ${
                        selectedAddressId === address.address_no
                          ? 'bg-primary bg-opacity-10 border-primary'
                          : ''
                      }`}
                      onClick={() => setSelectedAddressId(address.address_no)}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddressId === address.address_no}
                          onChange={() => setSelectedAddressId(address.address_no)}
                          className="text-primary"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-black dark:text-white">
                            #{address.address_no} - {address.line1}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {address.city}, {address.state} {address.zip}
                          </p>
                          {address.email1 && (
                            <p className="text-sm text-primary">{address.email1}</p>
                          )}
                          {address.phone1 && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">{address.phone1}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end p-6 border-t border-solid rounded-b border-stroke dark:border-strokedark">
            <button
              className="px-6 py-2 mb-1 mr-1 text-sm font-bold text-gray-500 uppercase transition-all duration-150 ease-linear outline-none background-transparent focus:outline-none"
              type="button"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              className="px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear rounded shadow outline-none bg-primary hover:shadow-lg focus:outline-none disabled:opacity-50"
              type="submit"
              onClick={handleSubmit}
              disabled={!selectedAddressId || saving}
            >
              {saving ? 'Adding...' : 'Add Address'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
