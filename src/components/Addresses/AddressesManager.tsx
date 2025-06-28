"use client";

import React, { useState, useEffect } from "react";
import { Address } from "@/types/company";
import AddressList from "./AddressList";
import AddressForm from "./AddressForm";

// Mock data
const mockAddresses: Address[] = [
  {
    address_no: 1,
    line1: "123 Main Street",
    line2: "Suite 200",
    line3: "",
    city: "New York",
    state: "NY",
    zip: "10001",
    country: "USA",
    phone1: "+1-212-555-0123",
    phone2: "",
    phone3: "",
    email1: "contact@company1.com",
    email2: "",
    website1: "www.company1.com",
    website2: "",
    fax: "+1-212-555-0124",
    verified: true,
  },
  {
    address_no: 2,
    line1: "456 Oak Avenue",
    line2: "",
    line3: "",
    city: "Los Angeles",
    state: "CA",
    zip: "90210",
    country: "USA",
    phone1: "+1-323-555-0456",
    phone2: "",
    phone3: "",
    email1: "info@company2.com",
    email2: "",
    website1: "www.company2.com",
    website2: "",
    fax: "",
    verified: false,
  },
];

export default function AddressesManager() {
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleCreate = () => {
    setEditingAddress(null);
    setShowForm(true);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleSave = (addressData: Omit<Address, "address_no">) => {
    if (editingAddress) {
      // Update existing address
      setAddresses(addresses.map(addr => 
        addr.address_no === editingAddress.address_no 
          ? { ...addressData, address_no: editingAddress.address_no }
          : addr
      ));
    } else {
      // Create new address
      const newAddress: Address = {
        ...addressData,
        address_no: Math.max(...addresses.map(a => a.address_no)) + 1,
      };
      setAddresses([...addresses, newAddress]);
    }
    setShowForm(false);
    setEditingAddress(null);
  };

  const handleDelete = (addressNo: number) => {
    if (confirm("Are you sure you want to delete this address?")) {
      setAddresses(addresses.filter(addr => addr.address_no !== addressNo));
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAddress(null);
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Addresses Management
        </h2>
        <button
          onClick={handleCreate}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90"
        >
          Add New Address
        </button>
      </div>

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
