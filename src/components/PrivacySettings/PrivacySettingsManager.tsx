"use client";

import React, { useState, useEffect } from 'react';
import { PrivacySetting } from '@/types/company';
import PrivacySettingsList from './PrivacySettingsList';
import PrivacySettingsForm from './PrivacySettingsForm';
import PrivacySettingsOverview from './PrivacySettingsOverview';
import PrivacyBulkActions from './PrivacyBulkActions';
import { privacySettingsApi } from '@/lib/privacySettingsApi';

const PrivacySettingsManager: React.FC = () => {
  const [privacySettings, setPrivacySettings] = useState<PrivacySetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPrivacySetting, setEditingPrivacySetting] = useState<PrivacySetting | undefined>();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Load privacy settings on component mount
  useEffect(() => {
    loadPrivacySettings();
  }, []);

  const loadPrivacySettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const settings = await privacySettingsApi.getAll();
      setPrivacySettings(settings);
    } catch (err) {
      setError('Failed to load privacy settings');
      console.error('Error loading privacy settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingPrivacySetting(undefined);
    setShowForm(true);
  };

  const handleEdit = (privacySetting: PrivacySetting) => {
    setEditingPrivacySetting(privacySetting);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this privacy setting?')) {
      try {
        await privacySettingsApi.delete(id);
        setPrivacySettings(privacySettings.filter(ps => ps.id !== id));
      } catch (err) {
        setError('Failed to delete privacy setting');
        console.error('Error deleting privacy setting:', err);
      }
    }
  };

  const handleToggleOnlinePrivacy = async (id: number) => {
    try {
      const setting = privacySettings.find(ps => ps.id === id);
      if (!setting) return;

      const updated = await privacySettingsApi.update(id, {
        is_private_online: !setting.is_private_online
      });

      setPrivacySettings(privacySettings.map(ps => 
        ps.id === id ? updated : ps
      ));
    } catch (err) {
      setError('Failed to update privacy setting');
      console.error('Error updating privacy setting:', err);
    }
  };

  const handleTogglePublicationPrivacy = async (id: number) => {
    try {
      const setting = privacySettings.find(ps => ps.id === id);
      if (!setting) return;

      const updated = await privacySettingsApi.update(id, {
        is_private_publication: !setting.is_private_publication
      });

      setPrivacySettings(privacySettings.map(ps => 
        ps.id === id ? updated : ps
      ));
    } catch (err) {
      setError('Failed to update privacy setting');
      console.error('Error updating privacy setting:', err);
    }
  };

  const handleBulkUpdate = async (ids: number[], updates: Partial<Pick<PrivacySetting, 'is_private_online' | 'is_private_publication'>>) => {
    try {
      const updated = await privacySettingsApi.bulkUpdate({ ids, ...updates });
      
      // Update local state with the returned updated settings
      setPrivacySettings(privacySettings.map(ps => {
        const updatedSetting = updated.find(u => u.id === ps.id);
        return updatedSetting || ps;
      }));
      
      setSelectedIds([]);
    } catch (err) {
      setError('Failed to bulk update privacy settings');
      console.error('Error bulk updating privacy settings:', err);
    }
  };

  const handleBulkDelete = async (ids: number[]) => {
    try {
      await privacySettingsApi.bulkDelete(ids);
      setPrivacySettings(privacySettings.filter(ps => !ids.includes(ps.id)));
      setSelectedIds([]);
    } catch (err) {
      setError('Failed to bulk delete privacy settings');
      console.error('Error bulk deleting privacy settings:', err);
    }
  };

  const handleSelectItem = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(prevId => prevId !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(privacySettings.map(ps => ps.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSave = async (privacySettingData: Omit<PrivacySetting, 'id'> | PrivacySetting) => {
    try {
      if ('id' in privacySettingData) {
        // Editing existing privacy setting
        const updated = await privacySettingsApi.update(privacySettingData.id, privacySettingData);
        setPrivacySettings(privacySettings.map(ps => 
          ps.id === privacySettingData.id ? updated : ps
        ));
      } else {
        // Adding new privacy setting
        const newPrivacySetting = await privacySettingsApi.create(privacySettingData);
        setPrivacySettings([...privacySettings, newPrivacySetting]);
      }
      setShowForm(false);
      setEditingPrivacySetting(undefined);
    } catch (err) {
      setError('Failed to save privacy setting');
      console.error('Error saving privacy setting:', err);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPrivacySetting(undefined);
  };

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="rounded-sm border border-red-300 bg-red-50 p-4 text-red-700 dark:border-red-600 dark:bg-red-900 dark:text-red-200">
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Loading privacy settings...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Overview Section */}
          <PrivacySettingsOverview privacySettings={privacySettings} />
          
          {/* Management Section */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-black dark:text-white">
                  Privacy Settings Management
                </h3>
                <button
                  onClick={handleAdd}
                  className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-4 text-center font-medium text-white hover:bg-opacity-90"
                >
                  Add Privacy Setting
                </button>
              </div>
            </div>

            <div className="p-6.5">
              <PrivacyBulkActions
                privacySettings={privacySettings}
                onBulkUpdate={handleBulkUpdate}
                onBulkDelete={handleBulkDelete}
                selectedIds={selectedIds}
                onSelectItem={handleSelectItem}
                onSelectAll={handleSelectAll}
              />
              <PrivacySettingsList
                privacySettings={privacySettings}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleOnlinePrivacy={handleToggleOnlinePrivacy}
                onTogglePublicationPrivacy={handleTogglePublicationPrivacy}
                selectedIds={selectedIds}
                onSelectItem={handleSelectItem}
                onSelectAll={handleSelectAll}
              />
            </div>

            {showForm && (
              <PrivacySettingsForm
                privacySetting={editingPrivacySetting}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PrivacySettingsManager;
