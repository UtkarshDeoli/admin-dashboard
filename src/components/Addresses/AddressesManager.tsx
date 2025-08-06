"use client";

import React, { useState, useEffect } from "react";
import { Address } from "@/types/company";
import { addressesAPI } from "@/lib/api";
import AddressList from "./AddressList";
import AddressModal from "./AddressModal";
import AddressViewModal from "./AddressViewModal";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import { useConfirmation } from "@/hooks/useConfirmation";

export default function AddressesManager() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [viewingAddress, setViewingAddress] = useState<Address | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Additional loading states for specific operations
  const [deleting, setDeleting] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [searching, setSearching] = useState(false);
  
  const { confirm, confirmationProps } = useConfirmation();

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

  // // Filter addresses based on search term
  // const filteredAddresses = addresses.filter(
  //   (address) =>
  //     address.line1.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     address.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     address.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     address.email1?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     address.phone1?.toLowerCase().includes(searchTerm.toLowerCase())
  // );

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
    const confirmed = await confirm(
      'Are you sure you want to perform this action?\nThis action will delete this address permanently.',
      {
        title: 'Delete Address',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        variant: 'danger'
      }
    );

    if (confirmed) {
      try {
        setDeleting(addressNo);
        await addressesAPI.delete(addressNo);
        await loadAddresses();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete address');
      } finally {
        setDeleting(null);
      }
    }
  };

  const handleSave = async (addressData: Omit<Address, "address_no">) => {
    try {
      setSaving(true);
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
    } finally {
      setSaving(false);
    }
  };

  const handleSearch = async (searchTerm: string) => {
    try {
      setSearching(true);
      if (searchTerm.trim() === "") {
        // If search term is empty, reload all addresses
        await loadAddresses();
        return;
      }

      const filtered = await addressesAPI.search(searchTerm);
      if (!filtered) {
        console.error('No addresses found for the given search term');
        return;
      } else {
        setAddresses(filtered);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search addresses');
    } finally {
      setSearching(false);
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
          <div className="relative">
            <input
              type="text"
              placeholder="Search addresses..."
              value={searchTerm}
              onChange={(e) => {
                handleSearch(e.target.value);
                setSearchTerm(e.target.value);       
              }}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary sm:w-80"
            />
            {searching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              </div>
            )}
          </div>
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
        addresses={addresses}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        deleting={deleting}
      />

      {/* Modals */}
      <AddressModal
        isOpen={showFormModal}
        onClose={handleCancel}
        address={editingAddress}
        onSave={handleSave}
        saving={saving}
      />

      <AddressViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        address={viewingAddress}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog {...confirmationProps} />
    </div>
  );
}
