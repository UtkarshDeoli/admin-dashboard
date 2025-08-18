"use client";

import React, { useState } from 'react';
import { PrivacySetting } from '@/types/company';

interface PrivacySettingsListProps {
  privacySettings: PrivacySetting[];
  onEdit: (privacySetting: PrivacySetting) => void;
  onDelete: (id: number) => void;
  onToggleOnlinePrivacy: (id: number) => void;
  onTogglePublicationPrivacy: (id: number) => void;
  selectedIds?: number[];
  onSelectItem?: (id: number, checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
}

const PrivacySettingsList: React.FC<PrivacySettingsListProps> = ({ 
  privacySettings, 
  onEdit, 
  onDelete, 
  onToggleOnlinePrivacy,
  onTogglePublicationPrivacy,
  selectedIds = [],
  onSelectItem,
  onSelectAll
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEntityType, setFilterEntityType] = useState('');
  const [filterPrivacy, setFilterPrivacy] = useState('');

  const filteredPrivacySettings = privacySettings.filter(ps => {
    const matchesSearch = 
      ps.entity_no.toString().includes(searchTerm) ||
      ps.entity_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ps.field_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEntityType = !filterEntityType || ps.entity_type === filterEntityType;
    const matchesPrivacy = !filterPrivacy || 
      (filterPrivacy === 'online-private' && ps.is_private_online) ||
      (filterPrivacy === 'publication-private' && ps.is_private_publication) ||
      (filterPrivacy === 'fully-private' && ps.is_private_online && ps.is_private_publication) ||
      (filterPrivacy === 'fully-public' && !ps.is_private_online && !ps.is_private_publication);
    
    return matchesSearch && matchesEntityType && matchesPrivacy;
  });

  const entityTypes = Array.from(new Set(privacySettings.map(ps => ps.entity_type)));

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by entity ID, type, or field name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-strokedark dark:bg-meta-4 dark:text-white"
          />
        </div>
        <div>
          <select
            value={filterEntityType}
            onChange={(e) => setFilterEntityType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-strokedark dark:bg-meta-4 dark:text-white"
          >
            <option value="">All Entity Types</option>
            {entityTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <select
            value={filterPrivacy}
            onChange={(e) => setFilterPrivacy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-strokedark dark:bg-meta-4 dark:text-white"
          >
            <option value="">All Privacy States</option>
            <option value="online-private">Online Private</option>
            <option value="publication-private">Publication Private</option>
            <option value="fully-private">Fully Private</option>
            <option value="fully-public">Fully Public</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              {onSelectItem && (
                <th className="px-4 py-4 font-medium text-black dark:text-white w-12">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredPrivacySettings.length && filteredPrivacySettings.length > 0}
                    ref={(el) => {
                      if (el && filteredPrivacySettings.length > 0) {
                        el.indeterminate = selectedIds.length > 0 && selectedIds.length < filteredPrivacySettings.length;
                      }
                    }}
                    onChange={(e) => onSelectAll?.(e.target.checked)}
                    className="rounded"
                  />
                </th>
              )}
              <th className="px-4 py-4 font-medium text-black dark:text-white">ID</th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">Entity</th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">Field Name</th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">Online Privacy</th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">Publication Privacy</th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPrivacySettings.map((ps) => (
              <tr key={ps.id} className="border-b border-stroke dark:border-strokedark">
                {onSelectItem && (
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(ps.id)}
                      onChange={(e) => onSelectItem(ps.id, e.target.checked)}
                      className="rounded"
                    />
                  </td>
                )}
                <td className="px-4 py-4 text-black dark:text-white">
                  {ps.id}
                </td>
                <td className="px-4 py-4">
                  <div>
                    <div className="font-medium text-black dark:text-white">
                      {ps.entity_type.charAt(0).toUpperCase() + ps.entity_type.slice(1)}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: {ps.entity_no}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-black dark:text-white">
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded dark:bg-gray-700">
                    {ps.field_name}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-2">
                    {ps.is_private_online ? (
                      <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                        Private
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                        Public
                      </span>
                    )}
                    <button
                      onClick={() => onToggleOnlinePrivacy(ps.id)}
                      className="text-xs text-blue-600 hover:text-blue-800 underline"
                    >
                      Toggle
                    </button>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-2">
                    {ps.is_private_publication ? (
                      <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                        Private
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                        Public
                      </span>
                    )}
                    <button
                      onClick={() => onTogglePublicationPrivacy(ps.id)}
                      className="text-xs text-blue-600 hover:text-blue-800 underline"
                    >
                      Toggle
                    </button>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEdit(ps)}
                      className="inline-flex items-center justify-center rounded bg-primary py-1 px-2 text-center font-medium text-white hover:bg-opacity-90 text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(ps.id)}
                      className="inline-flex items-center justify-center rounded bg-red-600 py-1 px-2 text-center font-medium text-white hover:bg-red-700 text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredPrivacySettings.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No privacy settings found.
          </div>
        )}
      </div>
    </div>
  );
};

export default PrivacySettingsList;
