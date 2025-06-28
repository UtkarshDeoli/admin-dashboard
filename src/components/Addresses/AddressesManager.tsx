"use client";

import React, { useState, useEffect } from "react";
import { Address } from "@/types/company";
import { addressesAPI } from "@/lib/api";
import AddressList from "./AddressList";
import AddressForm from "./AddressForm";

export default function AddressesManager() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleAdd = () => {
    setEditingAddress(null);
    setShowForm(true);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setShowForm(true);
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
      setShowForm(false);
      setEditingAddress(null);
      await loadAddresses();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save address');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAddress(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Address Management
        </h4>
        {!showForm && (
          <button
            onClick={handleAdd}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90"
          >
            Add New Address
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 flex w-full border-l-6 border-[#F87171] bg-[#F87171] bg-opacity-[15%] px-7 py-8 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-9">
          <div className="mr-5 flex h-9 w-full max-w-[36px] items-center justify-center rounded-lg bg-[#F87171]">
            <svg
              width="13"
              height="13"
              viewBox="0 0 13 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.4917 7.65579L11.106 12.2645C11.2545 12.4128 11.4715 12.5 11.6738 12.5C11.8762 12.5 12.0931 12.4128 12.2416 12.2645C12.5621 11.9445 12.5623 11.4317 12.2423 11.1114L7.6586 6.5027L12.2423 1.89502C12.5623 1.57553 12.5621 1.06272 12.2416 0.742739C11.9211 0.422585 11.4083 0.422707 11.0879 0.742739L6.4917 5.34991L1.89553 0.742739C1.57504 0.422707 1.06222 0.422585 0.741975 0.742739C0.421763 1.06272 0.421641 1.57553 0.741975 1.89502L5.32669 6.5027L0.741975 11.1114C0.421641 11.4317 0.421763 11.9445 0.741975 12.2645C0.882218 12.4128 1.09919 12.5 1.30156 12.5C1.50394 12.5 1.72091 12.4128 1.86115 12.2645L6.4917 7.65579Z"
                fill="white"
              />
            </svg>
          </div>
          <div className="w-full">
            <h3 className="text-lg font-semibold text-[#B45454]">Error!</h3>
            <p className="text-[#CD5D5D]">{error}</p>
          </div>
        </div>
      )}

      {showForm ? (
        <AddressForm
          address={editingAddress}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <AddressList
          addresses={addresses}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
