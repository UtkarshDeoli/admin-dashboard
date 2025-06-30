"use client";

import React, { useState, useEffect } from "react";
import { Address } from "@/types/company";
import { addressesAPI } from "@/lib/api";
import AddressList from "./AddressList";
import AddressModal from "./AddressModal";
import AddressViewModal from "./AddressViewModal";

export default function AddressesManager() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [viewingAddress, setViewingAddress] = useState<Address | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await addressesAPI.getAll();
      setAddresses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  // Filter addresses based on search term
  const filteredAddresses = addresses.filter(
    (address) =>
      address.line1.toLowerCase().includes(searchTerm.toLowerCase()) ||
      address.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      address.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      address.email1?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      address.phone1?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingAddress(null);
    setShowFormModal(true);
  };

  const handleView = (address: Address) => {
    setViewingAddress(address);
    setShowViewModal(true);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setShowFormModal(true);
  };

  const handleDelete = async (addressNo: number) => {
    if (confirm('Are you sure you want to delete this address?')) {
      try {
        await addressesAPI.delete(addressNo);
        await loadAddresses();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete address');
      }
    }
  };

  const handleSave = async (addressData: Omit<Address, "address_no">) => {
    try {
      if (editingAddress) {
        await addressesAPI.update(editingAddress.address_no, addressData);
      } else {
        await addressesAPI.create(addressData);
      }
      setShowFormModal(false);
      setEditingAddress(null);
      await loadAddresses();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save address');
    }
  };

  const handleCancel = () => {
    setShowFormModal(false);
    setEditingAddress(null);
  };

  if (loading) {
    return (
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Addresses Management
        </h4>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search addresses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary sm:w-80"
          />
          <button
            onClick={handleAdd}
            className="flex items-center justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
          >
            Add Address
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-sm border border-danger bg-danger bg-opacity-10 px-4 py-3 text-danger">
          <p>{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-sm underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <AddressList
        addresses={filteredAddresses}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modals */}
      <AddressModal
        isOpen={showFormModal}
        onClose={handleCancel}
        address={editingAddress}
        onSave={handleSave}
      />

      <AddressViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        address={viewingAddress}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
