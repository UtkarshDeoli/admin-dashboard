"use client";

import React, { useState, useEffect } from "react";
import { RentalStudio, Address } from "@/types/company";
import { rentalStudiosAPI, addressesAPI } from "@/lib/api";

interface RentalStudioFormProps {
  companyId: number;
  onSave: () => void;
}

export default function RentalStudioForm({ companyId, onSave }: RentalStudioFormProps) {
  const [rentalStudio, setRentalStudio] = useState<RentalStudio | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNewRentalStudio, setIsNewRentalStudio] = useState(false);

  const [formData, setFormData] = useState({
    address_no: 0,
    name: '',
    num_studios: 0,
    rate: 0,
    rate_frequency: 'Hourly' as 'Hourly' | 'Daily' | 'Weekly' | 'Monthly',
  });

  useEffect(() => {
    loadData();
  }, [companyId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load addresses for dropdown
      const addressData = await addressesAPI.getAll();
      setAddresses(addressData);
      
      // Try to load existing rental studio data
      try {
        const rentalStudioData = await rentalStudiosAPI.getByCompany(companyId);
        if (rentalStudioData) {
          console.log('Rental Studio Data:', rentalStudioData);
          setFormData({
            address_no: rentalStudioData.address_no,
            name: rentalStudioData.name,
            num_studios: rentalStudioData.num_studios,
            rate: rentalStudioData.rate,
            rate_frequency: rentalStudioData.rate_frequency,
          });
          setRentalStudio(rentalStudioData);
          setIsNewRentalStudio(false);
        } else {
          setIsNewRentalStudio(true);
        }
      } catch (err) {
        setIsNewRentalStudio(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      
      const rentalStudioData = {
        company_no: companyId,
        ...formData,
        archived: false
      };
      
      if (isNewRentalStudio) {
        await rentalStudiosAPI.create(rentalStudioData);
      } else if (rentalStudio) {
        await rentalStudiosAPI.update(rentalStudio.studio_no, rentalStudioData);
      }
      
      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save rental studio data');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6.5">
      <h3 className="mb-6 text-lg font-semibold text-black dark:text-white">
        Rental Studio Information
      </h3>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Address Selection */}
          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              Primary Address
            </label>
            <select
              name="address_no"
              value={formData.address_no}
              onChange={handleInputChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            >
              <option value={0}>Select an address</option>
              {addresses.map((address) => (
                <option key={address.address_no} value={address.address_no}>
                  {address.line1}, {address.city}, {address.state}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              Studio Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              Number of Studios
            </label>
            <input
              type="number"
              name="num_studios"
              value={formData.num_studios}
              onChange={handleInputChange}
              min="0"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              Rate
            </label>
            <input
              type="number"
              name="rate"
              value={formData.rate}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              Rate Frequency
            </label>
            <select
              name="rate_frequency"
              value={formData.rate_frequency}
              onChange={handleInputChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            >
              <option value="Hourly">Hourly</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center rounded bg-primary px-6 py-3 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50"
          >
            {saving ? (
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
            ) : null}
            {saving ? 'Saving...' : (isNewRentalStudio ? 'Create Rental Studio' : 'Update Rental Studio')}
          </button>
        </div>
      </form>
    </div>
  );
}
