"use client";

import React from "react";
import Modal from "@/components/common/Modal";
import AddressForm from "./AddressForm";
import { Address } from "@/types/company";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: Address | null;
  onSave: (address: Omit<Address, "address_no">) => void;
}

export default function AddressModal({ isOpen, onClose, address, onSave }: AddressModalProps) {
  const handleSave = (addressData: Omit<Address, "address_no">) => {
    onSave(addressData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={address ? "Edit Address" : "Add New Address"}
      size="lg"
    >
      <AddressForm
        address={address}
        onSave={handleSave}
        onCancel={onClose}
      />
    </Modal>
  );
}
