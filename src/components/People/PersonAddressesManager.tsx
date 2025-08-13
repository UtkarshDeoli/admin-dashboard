"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Address } from "@/types/company";
import { peopleAPI, addressesAPI } from "@/lib/api";
import { useConfirmation } from "@/hooks/useConfirmation";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import AddPersonAddressModal from "./AddPersonAddressModal";
import AddressForm from "@/components/Addresses/AddressForm";

interface PersonAddressesManagerProps {
  peopleId: number;
}

export default function PersonAddressesManager({ peopleId }: PersonAddressesManagerProps) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [allAddresses, setAllAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  
  const { confirm, confirmationProps } = useConfirmation();

  const loadAddresses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await peopleAPI.getAddresses(peopleId, showArchived);
      setAddresses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load addresses');
    } finally {
      setLoading(false);
    }
  }, [peopleId, showArchived]);

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

  const handleAddAddress = async (addressId: number) => {
    try {
      setIsAddingAddress(true);
      await peopleAPI.addAddress(peopleId, addressId);
      setShowAddModal(false);
      await loadAddresses();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add address');
    } finally {
      setIsAddingAddress(false);
    }
  };

  const handleCreateNewAddress = async (addressData: any) => {
    try {
      setIsAddingAddress(true);
      // Create the new address
      const newAddress = await addressesAPI.create(addressData);
      // Link the new address to the person
      await peopleAPI.addAddress(peopleId, newAddress.address_no);
      setShowNewAddressForm(false);
      await loadAddresses();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create and add address');
    } finally {
      setIsAddingAddress(false);
    }
  };

  const handleRemoveAddress = async (addressId: number) => {
    const confirmed = await confirm(
      'Are you sure you want to remove this address from the person?',
      {
        title: 'Remove Address',
        confirmText: 'Remove',
        cancelText: 'Cancel',
        variant: 'danger'
      }
    );

    if (confirmed) {
      try {
        await peopleAPI.removeAddress(peopleId, addressId);
        await loadAddresses();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to remove address');
      }
    }
  };

  const handleArchiveAddress = async (addressId: number, archived: boolean) => {
    const action = archived ? 'archive' : 'unarchive';
    const confirmed = await confirm(
      `Are you sure you want to ${action} this address relationship?`,
      {
        title: `${action.charAt(0).toUpperCase() + action.slice(1)} Address`,
        confirmText: action.charAt(0).toUpperCase() + action.slice(1),
        cancelText: 'Cancel',
        variant: 'warning'
      }
    );

    if (confirmed) {
      try {
        await peopleAPI.archiveAddress(peopleId, addressId, archived);
        await loadAddresses();
      } catch (err) {
        setError(err instanceof Error ? err.message : `Failed to ${action} address`);
      }
    }
  };

  const filteredAllAddresses = allAddresses.filter(addr => {
    const isAlreadyLinked = addresses.some(personAddr => personAddr.address_no === addr.address_no);
    return !isAlreadyLinked;
  });

  const formatAddress = (address: Address) => {
    const parts = [
      address.line1,
      address.line2,
      address.line3,
      `${address.city}, ${address.state} ${address.zip}`,
      address.country
    ].filter(Boolean);
    return parts.join(', ');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h5 className="text-lg font-semibold text-black dark:text-white">
              Addresses ({addresses.length})
            </h5>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage addresses associated with this person
            </p>
          </div>
          
          <div className="flex gap-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showArchived}
                onChange={(e) => setShowArchived(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-black dark:text-white">Show Archived</span>
            </label>
            
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center rounded bg-primary px-4 py-2 font-medium text-white hover:bg-opacity-90"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Existing Address
            </button>

            <button
              onClick={() => setShowNewAddressForm(true)}
              className="flex items-center justify-center rounded bg-meta-3 px-4 py-2 font-medium text-white hover:bg-opacity-90"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add New Address
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="rounded-sm border border-danger bg-danger bg-opacity-10 px-4 py-3 text-danger">
            <p>{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Addresses List */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  Address ID
                </th>
                <th className="min-w-[200px] px-4 py-4 font-medium text-black dark:text-white">
                  Address
                </th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  Contact
                </th>
                <th className="min-w-[80px] px-4 py-4 font-medium text-black dark:text-white">
                  Status
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {addresses.map((address) => (
                <tr key={address.address_no} className={address.relationship_archived ? "opacity-60" : ""}>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">#{address.address_no}</p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <div className="text-black dark:text-white">
                      <p className="font-medium">{address.line1}</p>
                      {address.line2 && <p className="text-sm text-gray-500">{address.line2}</p>}
                      {address.line3 && <p className="text-sm text-gray-500">{address.line3}</p>}
                      <p className="text-sm text-gray-500">
                        {address.city}, {address.state} {address.zip}
                      </p>
                      {address.country && <p className="text-sm text-gray-500">{address.country}</p>}
                    </div>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <div className="text-black dark:text-white">
                      {address.phone1 && <p className="text-sm">{address.phone1}</p>}
                      {address.email1 && <p className="text-sm">{address.email1}</p>}
                      {address.website1 && <p className="text-sm">{address.website1}</p>}
                    </div>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                        address.relationship_archived
                          ? "bg-warning bg-opacity-10 text-warning"
                          : "bg-success bg-opacity-10 text-success"
                      }`}
                    >
                      {address.relationship_archived ? "Archived" : "Active"}
                    </span>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                      <button
                        onClick={() => handleArchiveAddress(address.address_no, !address.relationship_archived)}
                        className="hover:text-warning"
                        title={address.relationship_archived ? "Unarchive" : "Archive"}
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                        >
                          <path d="M15.75 3.375H2.25C1.83579 3.375 1.5 3.71079 1.5 4.125V5.25C1.5 5.66421 1.83579 6 2.25 6H2.625V13.5C2.625 14.7426 3.63236 15.75 4.875 15.75H13.125C14.3676 15.75 15.375 14.7426 15.375 13.5V6H15.75C16.1642 6 16.5 5.66421 16.5 5.25V4.125C16.5 3.71079 16.1642 3.375 15.75 3.375ZM13.875 13.5C13.875 13.9142 13.5392 14.25 13.125 14.25H4.875C4.46079 14.25 4.125 13.9142 4.125 13.5V6H13.875V13.5ZM15 4.875V4.875H3V4.875H15Z"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleRemoveAddress(address.address_no)}
                        className="hover:text-danger"
                        title="Remove"
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                        >
                          <path d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"/>
                          <path d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"/>
                          <path d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"/>
                          <path d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.97558 13.4157C7.0037 13.4157 7.0037 13.4157 7.03183 13.4157C7.36933 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {addresses.length === 0 && (
          <div className="py-10 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No addresses found for this person.
            </p>
          </div>
        )}
      </div>

      <ConfirmationDialog {...confirmationProps} />
      
      <AddPersonAddressModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        addresses={filteredAllAddresses}
        onAdd={handleAddAddress}
        saving={isAddingAddress}
      />

      {showNewAddressForm && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-xl dark:bg-boxdark">
            <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-strokedark">
              <h3 className="text-lg font-semibold text-black dark:text-white">
                Add New Address
              </h3>
              <button
                onClick={() => setShowNewAddressForm(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <AddressForm
              address={null}
              onSave={handleCreateNewAddress}
              onCancel={() => setShowNewAddressForm(false)}
              saving={isAddingAddress}
            />
          </div>
        </div>
      )}
    </>
  );
}
