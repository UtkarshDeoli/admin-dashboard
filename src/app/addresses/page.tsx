"use client";

import React, { useState, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Address } from "@/types/company";
import { addressesAPI } from "@/lib/api";

export default function Addresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    line1: "",
    line2: "",
    line3: "",
    city: "",
    state: "",
    zip: "",
    country: "USA",
    phone1: "",
    phone2: "",
    phone3: "",
    email1: "",
    email2: "",
    website1: "",
    website2: "",
    fax: "",
    verified: false
  });

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
    setFormData({
      line1: "",
      line2: "",
      line3: "",
      city: "",
      state: "",
      zip: "",
      country: "USA",
      phone1: "",
      phone2: "",
      phone3: "",
      email1: "",
      email2: "",
      website1: "",
      website2: "",
      fax: "",
      verified: false
    });
    setShowForm(true);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      line1: address.line1 || "",
      line2: address.line2 || "",
      line3: address.line3 || "",
      city: address.city || "",
      state: address.state || "",
      zip: address.zip || "",
      country: address.country || "USA",
      phone1: address.phone1 || "",
      phone2: address.phone2 || "",
      phone3: address.phone3 || "",
      email1: address.email1 || "",
      email2: address.email2 || "",
      website1: address.website1 || "",
      website2: address.website2 || "",
      fax: address.fax || "",
      verified: address.verified || false
    });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        await addressesAPI.update(editingAddress.address_no, formData);
      } else {
        await addressesAPI.create(formData);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  if (loading) {
    return (
      <DefaultLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Addresses ({addresses.length})
          </h4>
          <button
            onClick={handleAdd}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90"
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

        {error && (
          <div className="mb-4 flex w-full border-l-6 border-[#F87171] bg-[#F87171] bg-opacity-[15%] px-7 py-8 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-9">
            <div className="w-full">
              <h3 className="text-lg font-semibold text-[#B45454]">Error!</h3>
              <p className="text-[#CD5D5D]">{error}</p>
            </div>
          </div>
        )}

        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  Address
                </th>
                <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                  City, State
                </th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  Phone
                </th>
                <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                  Email
                </th>
                <th className="min-w-[80px] px-4 py-4 font-medium text-black dark:text-white">
                  Verified
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {addresses.map((address) => (
                <tr key={address.address_no}>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <div className="text-black dark:text-white">
                      {address.line1}
                      {address.line2 && <div className="text-sm text-gray-500">{address.line2}</div>}
                    </div>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {address.city}, {address.state} {address.zip}
                    </p>
                    <p className="text-sm text-gray-500">{address.country}</p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">{address.phone1}</p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">{address.email1}</p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                        address.verified
                          ? "bg-success bg-opacity-10 text-success"
                          : "bg-warning bg-opacity-10 text-warning"
                      }`}
                    >
                      {address.verified ? "Verified" : "Unverified"}
                    </span>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                      <button
                        onClick={() => handleEdit(address)}
                        className="hover:text-primary"
                        title="Edit"
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                        >
                          <path d="M16.8754 11.6719C16.5379 11.6719 16.2285 11.9531 16.2285 12.3187V14.8219C16.2285 15.075 16.0316 15.2719 15.7785 15.2719H2.22227C1.96914 15.2719 1.77227 15.075 1.77227 14.8219V12.3187C1.77227 11.9812 1.49102 11.6719 1.12539 11.6719C0.759766 11.6719 0.478516 11.9531 0.478516 12.3187V14.8219C0.478516 15.7781 1.23789 16.5375 2.19414 16.5375H15.7785C16.7348 16.5375 17.4941 15.7781 17.4941 14.8219V12.3187C17.5223 11.9531 17.2129 11.6719 16.8754 11.6719Z"/>
                          <path d="M8.55074 12.3469C8.66324 12.4594 8.83199 12.5156 9.00074 12.5156C9.16949 12.5156 9.31012 12.4594 9.45074 12.3469L13.4726 8.43752C13.7257 8.1844 13.7257 7.79065 13.5007 7.53752C13.2476 7.2844 12.8539 7.2844 12.6007 7.5094L9.64762 10.4063V2.1094C9.64762 1.7719 9.36637 1.46252 9.00074 1.46252C8.63512 1.46252 8.35387 1.74377 8.35387 2.1094V10.4063L5.40074 7.53752C5.14762 7.2844 4.75387 7.31252 4.50074 7.56565C4.24762 7.81877 4.27574 8.21252 4.52887 8.46565L8.55074 12.3469Z"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(address.address_no)}
                        className="hover:text-danger"
                        title="Delete"
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                        >
                          <path d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {addresses.length === 0 && !loading && (
          <div className="py-10 text-center">
            <p className="text-gray-500 dark:text-gray-400">No addresses found.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Address Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl dark:bg-boxdark">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-black dark:text-white">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h3>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Address Line 1 */}
                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    name="line1"
                    value={formData.line1}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter address line 1"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                {/* Address Line 2 */}
                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    name="line2"
                    value={formData.line2}
                    onChange={handleInputChange}
                    placeholder="Enter address line 2"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                {/* Address Line 3 */}
                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Address Line 3
                  </label>
                  <input
                    type="text"
                    name="line3"
                    value={formData.line3}
                    onChange={handleInputChange}
                    placeholder="Enter address line 3"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter city"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                {/* State */}
                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter state"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                {/* ZIP Code */}
                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    placeholder="Enter ZIP code"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Country
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  >
                    <option value="USA">USA</option>
                    <option value="Canada">Canada</option>
                    <option value="UK">UK</option>
                    <option value="Australia">Australia</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Phone 1 */}
                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Phone 1
                  </label>
                  <input
                    type="tel"
                    name="phone1"
                    value={formData.phone1}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                {/* Phone 2 */}
                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Phone 2
                  </label>
                  <input
                    type="tel"
                    name="phone2"
                    value={formData.phone2}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                {/* Email 1 */}
                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Email 1
                  </label>
                  <input
                    type="email"
                    name="email1"
                    value={formData.email1}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                {/* Email 2 */}
                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Email 2
                  </label>
                  <input
                    type="email"
                    name="email2"
                    value={formData.email2}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                {/* Website 1 */}
                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Website 1
                  </label>
                  <input
                    type="url"
                    name="website1"
                    value={formData.website1}
                    onChange={handleInputChange}
                    placeholder="Enter website URL"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                {/* Fax */}
                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Fax
                  </label>
                  <input
                    type="tel"
                    name="fax"
                    value={formData.fax}
                    onChange={handleInputChange}
                    placeholder="Enter fax number"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>

              {/* Verified Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="verified"
                  name="verified"
                  checked={formData.verified}
                  onChange={handleInputChange}
                  className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="verified" className="text-black dark:text-white">
                  Verified Address
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-primary px-4 py-2 text-white hover:bg-opacity-90"
                >
                  {editingAddress ? 'Update Address' : 'Add Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
}
