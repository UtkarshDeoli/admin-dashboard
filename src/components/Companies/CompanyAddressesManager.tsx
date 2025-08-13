"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Address } from "@/types/company";
import { companiesAPI, addressesAPI } from "@/lib/api";
import AddressModal from "../Addresses/AddressModal";
import AddressViewModal from "../Addresses/AddressViewModal";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import { useConfirmation } from "@/hooks/useConfirmation";
import CompanyAddressList from "./CompanyAddressList";
import AddCompanyAddressModal from "./AddCompanyAddressModal";

interface CompanyAddressesManagerProps {
  companyId: number;
}

export default function CompanyAddressesManager({ companyId }: CompanyAddressesManagerProps) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [allAddresses, setAllAddresses] = useState<Address[]>([]);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [viewingAddress, setViewingAddress] = useState<Address | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Additional loading states for specific operations
  const [deleting, setDeleting] = useState<number | null>(null);
  const [archiving, setArchiving] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  
  const { confirm, confirmationProps } = useConfirmation();

  const loadAddresses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await companiesAPI.getAddresses(companyId, showArchived);
      setAddresses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load company addresses');
    } finally {
      setLoading(false);
    }
  }, [companyId, showArchived]);

  const loadAllAddresses = useCallback(async () => {
    try {
      const data = await addressesAPI.getAll();
      setAllAddresses(data);
    } catch (err) {
      console.error('Failed to load all addresses:', err);
    }
  }, []);

  useEffect(() => {
    loadAddresses();
    loadAllAddresses();
  }, [loadAddresses, loadAllAddresses]);

  const handleAddExisting = () => {
    setShowAddModal(true);
  };

  const handleCreateNew = () => {
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

  const handleArchive = async (addressNo: number, isArchived: boolean) => {
    const action = isArchived ? 'unarchive' : 'archive';
    const confirmed = await confirm(
      `Are you sure you want to ${action} this address for this company?\n${isArchived ? 'This will restore the address relationship.' : 'This will archive the address relationship but keep the address data.'}`,
      {
        title: `${action.charAt(0).toUpperCase() + action.slice(1)} Address`,
        confirmText: action.charAt(0).toUpperCase() + action.slice(1),
        cancelText: 'Cancel',
        variant: isArchived ? 'info' : 'warning'
      }
    );

    if (confirmed) {
      try {
        setArchiving(addressNo);
        await companiesAPI.archiveAddress(companyId, addressNo, !isArchived);
        await loadAddresses();
      } catch (err) {
        setError(err instanceof Error ? err.message : `Failed to ${action} address`);
      } finally {
        setArchiving(null);
      }
    }
  };

  const handleDelete = async (addressNo: number) => {
    const confirmed = await confirm(
      'Are you sure you want to remove this address from the company?\nThis will permanently delete the relationship between the company and address.',
      {
        title: 'Remove Address',
        confirmText: 'Remove',
        cancelText: 'Cancel',
        variant: 'danger'
      }
    );

    if (confirmed) {
      try {
        setDeleting(addressNo);
        await companiesAPI.removeAddress(companyId, addressNo);
        await loadAddresses();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to remove address');
      } finally {
        setDeleting(null);
      }
    }
  };

  const handleSaveAddress = async (addressData: Omit<Address, "address_no">) => {
    try {
      setSaving(true);
      if (editingAddress) {
        await addressesAPI.update(editingAddress.address_no, addressData);
      } else {
        const newAddress = await addressesAPI.create(addressData);
        // Automatically add the new address to the company
        await companiesAPI.addAddress(companyId, newAddress.address_no);
      }
      setShowFormModal(false);
      setEditingAddress(null);
      await loadAddresses();
      await loadAllAddresses();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save address');
    } finally {
      setSaving(false);
    }
  };

  const handleAddAddress = async (addressId: number, locaction: string) => {
    try {
      setSaving(true);
      await companiesAPI.addAddress(companyId, addressId, locaction);
      setShowAddModal(false);
      await loadAddresses();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add address to company');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setShowFormModal(false);
    setEditingAddress(null);
  };

  const handleCancelAdd = () => {
    setShowAddModal(false);
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

  // Filter out addresses that are already linked to this company
  const availableAddresses = allAddresses.filter(addr => 
    !addresses.some(companyAddr => companyAddr.address_no === addr.address_no)
  );

  return (
    <div className="space-y-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Company Addresses
        </h4>
        <div className="flex gap-3 items-center">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showArchived}
              onChange={(e) => setShowArchived(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Show Archived</span>
          </label>
          <button
            onClick={handleAddExisting}
            className="flex items-center justify-center rounded border border-primary px-4 py-2 font-medium text-primary hover:bg-primary hover:text-white"
          >
            Add Existing
          </button>
          <button
            onClick={handleCreateNew}
            className="flex items-center justify-center rounded bg-primary px-4 py-2 font-medium text-white hover:bg-opacity-90"
          >
            Create New
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

      <CompanyAddressList
        addresses={addresses}
        onView={handleView}
        onEdit={handleEdit}
        onArchive={handleArchive}
        onDelete={handleDelete}
        deleting={deleting}
        archiving={archiving}
      />

      {/* Modals */}
      <AddressModal
        isOpen={showFormModal}
        onClose={handleCancel}
        address={editingAddress}
        onSave={handleSaveAddress}
        saving={saving}
      />

      <AddressViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        address={viewingAddress}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AddCompanyAddressModal
        isOpen={showAddModal}
        onClose={handleCancelAdd}
        addresses={availableAddresses}
        onAdd={handleAddAddress}
        saving={saving}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog {...confirmationProps} />
    </div>
  );
}
