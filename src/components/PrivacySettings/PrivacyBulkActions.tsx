"use client";

import React, { useState } from 'react';
import { PrivacySetting } from '@/types/company';

interface PrivacyBulkActionsProps {
  privacySettings: PrivacySetting[];
  onBulkUpdate: (ids: number[], updates: Partial<Pick<PrivacySetting, 'is_private_online' | 'is_private_publication'>>) => void;
  onBulkDelete: (ids: number[]) => void;
  selectedIds: number[];
  onSelectItem: (id: number, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
}

const PrivacyBulkActions: React.FC<PrivacyBulkActionsProps> = ({
  privacySettings,
  onBulkUpdate,
  onBulkDelete,
  selectedIds,
  onSelectItem,
  onSelectAll
}) => {
  const [showBulkMenu, setShowBulkMenu] = useState(false);

  const handleSelectAllLocal = (checked: boolean) => {
    onSelectAll(checked);
  };

  const handleBulkAction = (action: string) => {
    if (selectedIds.length === 0) return;

    switch (action) {
      case 'make-online-private':
        onBulkUpdate(selectedIds, { is_private_online: true });
        break;
      case 'make-online-public':
        onBulkUpdate(selectedIds, { is_private_online: false });
        break;
      case 'make-publication-private':
        onBulkUpdate(selectedIds, { is_private_publication: true });
        break;
      case 'make-publication-public':
        onBulkUpdate(selectedIds, { is_private_publication: false });
        break;
      case 'make-fully-private':
        onBulkUpdate(selectedIds, { is_private_online: true, is_private_publication: true });
        break;
      case 'make-fully-public':
        onBulkUpdate(selectedIds, { is_private_online: false, is_private_publication: false });
        break;
      case 'delete':
        if (confirm(`Are you sure you want to delete ${selectedIds.length} privacy settings?`)) {
          onBulkDelete(selectedIds);
        }
        break;
    }
    
    // Note: selection clearing is handled by parent component
    setShowBulkMenu(false);
  };

  const allSelected = selectedIds.length === privacySettings.length;
  const someSelected = selectedIds.length > 0;

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={allSelected}
              ref={(el) => {
                if (el) el.indeterminate = someSelected && !allSelected;
              }}
              onChange={(e) => handleSelectAllLocal(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {selectedIds.length > 0 ? `${selectedIds.length} selected` : 'Select all'}
            </span>
          </label>
        </div>

        {selectedIds.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setShowBulkMenu(!showBulkMenu)}
              className="inline-flex items-center justify-center rounded-md bg-gray-100 py-2 px-4 text-center font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Bulk Actions ({selectedIds.length})
              <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showBulkMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1">
                  <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Online Privacy
                  </div>
                  <button
                    onClick={() => handleBulkAction('make-online-private')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Make Online Private
                  </button>
                  <button
                    onClick={() => handleBulkAction('make-online-public')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Make Online Public
                  </button>
                  
                  <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                  
                  <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Publication Privacy
                  </div>
                  <button
                    onClick={() => handleBulkAction('make-publication-private')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Make Publication Private
                  </button>
                  <button
                    onClick={() => handleBulkAction('make-publication-public')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Make Publication Public
                  </button>
                  
                  <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                  
                  <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Combined Actions
                  </div>
                  <button
                    onClick={() => handleBulkAction('make-fully-private')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Make Fully Private
                  </button>
                  <button
                    onClick={() => handleBulkAction('make-fully-public')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Make Fully Public
                  </button>
                  
                  <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                  
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900"
                  >
                    Delete Selected
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Render checkboxes for individual items */}
      <div className="hidden">
        {privacySettings.map(ps => (
          <input
            key={ps.id}
            type="checkbox"
            checked={selectedIds.includes(ps.id)}
            onChange={(e) => onSelectItem(ps.id, e.target.checked)}
            data-item-id={ps.id}
          />
        ))}
      </div>
    </div>
  );
};

export default PrivacyBulkActions;
