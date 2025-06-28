"use client";

import React, { useState, useEffect } from 'react';
import { PrivacySetting } from '@/types/company';

interface PrivacySettingsFormProps {
  privacySetting?: PrivacySetting;
  onSave: (privacySetting: Omit<PrivacySetting, 'id'> | PrivacySetting) => void;
  onCancel: () => void;
}

const PrivacySettingsForm: React.FC<PrivacySettingsFormProps> = ({ 
  privacySetting, 
  onSave, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    entity_no: 0,
    entity_type: 'company',
    field_name: '',
    is_private: false
  });

  useEffect(() => {
    if (privacySetting) {
      setFormData({
        entity_no: privacySetting.entity_no,
        entity_type: privacySetting.entity_type,
        field_name: privacySetting.field_name,
        is_private: privacySetting.is_private
      });
    }
  }, [privacySetting]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (privacySetting) {
      onSave({ ...privacySetting, ...formData });
    } else {
      onSave(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              name === 'entity_no' ? parseInt(value) || 0 : value
    }));
  };

  const entityTypes = ['company', 'person', 'project', 'address'];
  
  // Common field names for different entity types
  const fieldOptions = {
    company: ['name', 'description', 'fka', 'acronym', 'verified'],
    person: ['first_name', 'middle_name', 'last_name', 'address_no', 'no_book'],
    project: ['name', 'aka', 'fka', 'description', 'start_date', 'end_date', 'city1', 'state1', 'country1'],
    address: ['line1', 'line2', 'line3', 'city', 'state', 'zip', 'country', 'phone1', 'phone2', 'phone3', 'email1', 'email2', 'website1', 'website2', 'fax']
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          {privacySetting ? 'Edit Privacy Setting' : 'Add Privacy Setting'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Entity Type *
            </label>
            <select
              name="entity_type"
              value={formData.entity_type}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {entityTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Entity Number *
            </label>
            <input
              type="number"
              name="entity_no"
              value={formData.entity_no}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Field Name *
            </label>
            <select
              name="field_name"
              value={formData.field_name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Field</option>
              {fieldOptions[formData.entity_type as keyof typeof fieldOptions]?.map(field => (
                <option key={field} value={field}>
                  {field}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Select which field should have privacy settings applied
            </p>
          </div>

          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_private"
                checked={formData.is_private}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Make this field private</span>
            </label>
          </div>

          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-xs text-gray-600">
              <strong>Note:</strong> Private fields will be hidden from public view and require special permissions to access.
            </p>
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
              {privacySetting ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrivacySettingsForm;
