"use client";

import React, { useState, useEffect } from 'react';
import { PrivacySetting } from '@/types/company';
import { privacySettingsApi } from '@/lib/privacySettingsApi';

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
    entity_type: 'Company' as 'Company' | 'People' | 'Address' | 'Agency',
    field_name: '',
    is_private_online: false,
    is_private_publication: false
  });

  const [availableFields, setAvailableFields] = useState<string[]>([]);
  const [loadingFields, setLoadingFields] = useState(false);

  useEffect(() => {
    if (privacySetting) {
      setFormData({
        entity_no: privacySetting.entity_no,
        entity_type: privacySetting.entity_type,
        field_name: privacySetting.field_name,
        is_private_online: privacySetting.is_private_online,
        is_private_publication: privacySetting.is_private_publication
      });
    }
  }, [privacySetting]);

  // Load available fields when entity type changes
  useEffect(() => {
    loadAvailableFields(formData.entity_type);
  }, [formData.entity_type]);

  const loadAvailableFields = async (entityType: string) => {
    try {
      setLoadingFields(true);
      const fields = await privacySettingsApi.getAvailableFields(entityType);
      setAvailableFields(fields);
    } catch (err) {
      console.error('Error loading available fields:', err);
      setAvailableFields([]);
    } finally {
      setLoadingFields(false);
    }
  };

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
              name === 'entity_no' ? parseInt(value) || 0 : value,
      // Clear field_name when entity_type changes
      ...(name === 'entity_type' ? { field_name: '' } : {})
    }));
  };

  const entityTypes = ['Company', 'People', 'Address', 'Agency'];

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
              Entity ID *
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
              disabled={loadingFields}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">
                {loadingFields ? 'Loading fields...' : 'Select Field'}
              </option>
              {availableFields.map(field => (
                <option key={field} value={field}>
                  {field}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Select which field should have privacy settings applied
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="is_private_online"
                  checked={formData.is_private_online}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Make this field private online</span>
              </label>
            </div>
            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="is_private_publication"
                  checked={formData.is_private_publication}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Make this field private for publications</span>
              </label>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-xs text-gray-600">
              <strong>Note:</strong> 
              <br />• <strong>Online Privacy:</strong> Field will be hidden from website view and require special permissions to access.
              <br />• <strong>Publication Privacy:</strong> Field will be excluded from any printed books or publications.
              <br />• Both privacy settings can be enabled independently for maximum control.
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
