"use client";

import React, { useState, useEffect, useCallback } from "react";
import { RentalSpace, Address } from "@/types/company";

interface RentalSpaceFormProps {
  companyId: number;
  onSave: () => void;
}

export default function RentalSpaceForm({ companyId, onSave }: RentalSpaceFormProps) {
  const [rentalSpace, setRentalSpace] = useState<RentalSpace | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNewRentalSpace, setIsNewRentalSpace] = useState(false);

  const [formData, setFormData] = useState({
    address_no: 0,
    name: '',
    dimensions: '',
    seats: 0,
    space_type: '',
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load addresses for dropdown
      const addressResponse = await fetch('/api/addresses');
      if (addressResponse.ok) {
        const addressData = await addressResponse.json();
        setAddresses(addressData);
      }
      
      // Try to load existing rental space data
      try {
        const response = await fetch(`/api/companies/${companyId}/rental-space`);
        if (response.ok) {
          const rentalSpaceData = await response.json();
          if (rentalSpaceData) {
            setRentalSpace(rentalSpaceData);
            setFormData({
              address_no: rentalSpaceData.address_no,
              name: rentalSpaceData.name,
              dimensions: rentalSpaceData.dimensions,
              seats: rentalSpaceData.seats,
              space_type: rentalSpaceData.space_type,
            });
            setIsNewRentalSpace(false);
          } else {
            setIsNewRentalSpace(true);
          }
        } else {
          setIsNewRentalSpace(true);
        }
      } catch (err) {
        setIsNewRentalSpace(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      
      const rentalSpaceData = {
        company_no: companyId,
        ...formData,
        archived: false
      };
      
      if (isNewRentalSpace) {
        const response = await fetch('/api/rental-spaces', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(rentalSpaceData),
        });
        
        if (!response.ok) {
          throw new Error('Failed to create rental space');
        }
      } else if (rentalSpace) {
        const response = await fetch(`/api/rental-spaces/${rentalSpace.space_no}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(rentalSpaceData),
        });
        
        if (!response.ok) {
          throw new Error('Failed to update rental space');
        }
      }
      
      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save rental space data');
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
        Rental Space Information
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
              <option value={0}>No address</option>
              {addresses.map((address) => (
                <option key={address.address_no} value={address.address_no}>
                  {`${address.line1}${address.line2 ? ', ' + address.line2 : ''}, ${address.city}, ${address.state} ${address.zip}`}
                </option>
              ))}
            </select>
          </div>

          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              Space Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          {/* Dimensions */}
          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              Dimensions
            </label>
            <input
              type="text"
              name="dimensions"
              value={formData.dimensions}
              onChange={handleInputChange}
              placeholder="e.g., 20x30 feet"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          {/* Space Type */}
          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              Space Type
            </label>
            <input
              type="text"
              name="space_type"
              value={formData.space_type}
              onChange={handleInputChange}
              placeholder="e.g., Studio, Conference Room, Theater, etc."
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          {/* Seats */}
          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              Number of Seats
            </label>
            <input
              type="number"
              name="seats"
              value={formData.seats}
              onChange={handleInputChange}
              min="0"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center rounded bg-primary px-6 py-3 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50"
          >
            {saving ? (
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
            ) : null}
            {saving ? 'Saving...' : (isNewRentalSpace ? 'Create Rental Space' : 'Update Rental Space')}
          </button>
        </div>
      </form>
    </div>
  );
}
