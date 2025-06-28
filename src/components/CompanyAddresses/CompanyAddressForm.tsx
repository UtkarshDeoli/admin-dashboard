"use client";

import React, { useState, useEffect } from 'react';
import { CompanyAddress } from '@/types/company';

interface CompanyAddressFormProps {
  companyAddress?: CompanyAddress;
  onSave: (companyAddress: Omit<CompanyAddress, 'id'> | CompanyAddress) => void;
  onCancel: () => void;
}

const CompanyAddressForm: React.FC<CompanyAddressFormProps> = ({ 
  companyAddress, 
  onSave, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    company_no: 0,
    address_no: 0,
    archived: false,
    locaction: ''
  });

  useEffect(() => {
    if (companyAddress) {
      setFormData({
        company_no: companyAddress.company_no,
        address_no: companyAddress.address_no,
        archived: companyAddress.archived,
        locaction: companyAddress.locaction
      });
    }
  }, [companyAddress]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (companyAddress) {
      onSave({ ...companyAddress, ...formData });
    } else {
      onSave(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              (name === 'company_no' || name === 'address_no') ? parseInt(value) || 0 : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          {companyAddress ? 'Edit Company-Address Association' : 'Add Company-Address Association'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Number *
            </label>
            <input
              type="number"
              name="company_no"
              value={formData.company_no}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address Number *
            </label>
            <input
              type="number"
              name="address_no"
              value={formData.address_no}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location Description
            </label>
            <input
              type="text"
              name="locaction"
              value={formData.locaction}
              onChange={handleChange}
              placeholder="e.g., Main Office, Warehouse, Secondary Location"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Optional description of what this address represents for the company
            </p>
          </div>

          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="archived"
                checked={formData.archived}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Archived</span>
            </label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {companyAddress ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyAddressForm;
