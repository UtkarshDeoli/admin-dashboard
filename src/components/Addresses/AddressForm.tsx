"use client";

import React, { useState } from "react";
import { Address } from "@/types/company";

interface AddressFormProps {
  address: Address | null;
  onSave: (address: Omit<Address, "address_no">) => void;
  onCancel: () => void;
  saving?: boolean;
}

export default function AddressForm({ address, onSave, onCancel, saving }: AddressFormProps) {
  const [formData, setFormData] = useState({
    line1: address?.line1 || "",
    line2: address?.line2 || "",
    line3: address?.line3 || "",
    city: address?.city || "",
    state: address?.state || "",
    zip: address?.zip || "",
    country: address?.country || "USA",
    phone1: address?.phone1 || "",
    phone2: address?.phone2 || "",
    phone3: address?.phone3 || "",
    email1: address?.email1 || "",
    email2: address?.email2 || "",
    website1: address?.website1 || "",
    website2: address?.website2 || "",
    fax: address?.fax || "",
    verified: address?.verified || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-6.5">
          <div className="mb-4.5 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Address Line 1 <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                name="line1"
                value={formData.line1}
                onChange={handleChange}
                required
                placeholder="Enter address line 1"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Address Line 2
              </label>
              <input
                type="text"
                name="line2"
                value={formData.line2}
                onChange={handleChange}
                placeholder="Enter address line 2"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
          </div>

          <div className="mb-4.5">
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Address Line 3
            </label>
            <input
              type="text"
              name="line3"
              value={formData.line3}
              onChange={handleChange}
              placeholder="Enter address line 3"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          <div className="mb-4.5 grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                City <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                placeholder="Enter city"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                State <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                placeholder="Enter state"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                ZIP Code <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                required
                placeholder="Enter ZIP code"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
          </div>

          <div className="mb-4.5">
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Country <span className="text-meta-1">*</span>
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              placeholder="Enter country"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          <div className="mb-4.5 grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Phone 1
              </label>
              <input
                type="tel"
                name="phone1"
                value={formData.phone1}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Phone 2
              </label>
              <input
                type="tel"
                name="phone2"
                value={formData.phone2}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Phone 3
              </label>
              <input
                type="tel"
                name="phone3"
                value={formData.phone3}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
          </div>

          <div className="mb-4.5 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Email 1
              </label>
              <input
                type="email"
                name="email1"
                value={formData.email1}
                onChange={handleChange}
                placeholder="Enter email address"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Email 2
              </label>
              <input
                type="email"
                name="email2"
                value={formData.email2}
                onChange={handleChange}
                placeholder="Enter email address"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
          </div>

          <div className="mb-4.5 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Website 1
              </label>
              <input
                type="url"
                name="website1"
                value={formData.website1}
                onChange={handleChange}
                placeholder="Enter website URL"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Website 2
              </label>
              <input
                type="url"
                name="website2"
                value={formData.website2}
                onChange={handleChange}
                placeholder="Enter website URL"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
          </div>

          <div className="mb-4.5">
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Fax
            </label>
            <input
              type="tel"
              name="fax"
              value={formData.fax}
              onChange={handleChange}
              placeholder="Enter fax number"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          <div className="mb-5.5">
            <label className="mb-3 flex cursor-pointer select-none items-center text-sm font-medium text-black dark:text-white">
              <div className="relative">
                <input
                  type="checkbox"
                  name="verified"
                  checked={formData.verified}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div
                  className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${
                    formData.verified
                      ? "border-primary bg-gray dark:bg-transparent"
                      : "border-stroke dark:border-strokedark"
                  }`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-sm ${
                      formData.verified ? "bg-primary" : ""
                    }`}
                  ></span>
                </div>
              </div>
              Verified Address
            </label>
          </div>

          <div className="flex gap-4.5">
            <button
              type="submit"
              disabled={saving}
              className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {address ? "Updating..." : "Creating..."}
                </div>
              ) : (
                address ? "Update Address" : "Create Address"
              )}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="flex w-full justify-center rounded border border-stroke p-3 font-medium text-black hover:border-black dark:border-strokedark dark:text-white dark:hover:border-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
  );
}
