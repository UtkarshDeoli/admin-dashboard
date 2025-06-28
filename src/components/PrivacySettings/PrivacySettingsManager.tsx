"use client";

import React, { useState } from 'react';
import { PrivacySetting } from '@/types/company';
import PrivacySettingsList from './PrivacySettingsList';
import PrivacySettingsForm from './PrivacySettingsForm';

const PrivacySettingsManager: React.FC = () => {
  const [privacySettings, setPrivacySettings] = useState<PrivacySetting[]>([
    {
      id: 1,
      entity_no: 1,
      entity_type: "company",
      field_name: "phone1",
      is_private: true
    },
    {
      id: 2,
      entity_no: 1,
      entity_type: "company",
      field_name: "email1",
      is_private: false
    },
    {
      id: 3,
      entity_no: 2,
      entity_type: "company",
      field_name: "description",
      is_private: true
    },
    {
      id: 4,
      entity_no: 1,
      entity_type: "person",
      field_name: "address_no",
      is_private: true
    },
    {
      id: 5,
      entity_no: 1,
      entity_type: "address",
      field_name: "phone1",
      is_private: false
    },
    {
      id: 6,
      entity_no: 2,
      entity_type: "person",
      field_name: "first_name",
      is_private: true
    },
    {
      id: 7,
      entity_no: 1,
      entity_type: "project",
      field_name: "description",
      is_private: false
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingPrivacySetting, setEditingPrivacySetting] = useState<PrivacySetting | undefined>();

  const handleAdd = () => {
    setEditingPrivacySetting(undefined);
    setShowForm(true);
  };

  const handleEdit = (privacySetting: PrivacySetting) => {
    setEditingPrivacySetting(privacySetting);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this privacy setting?')) {
      setPrivacySettings(privacySettings.filter(ps => ps.id !== id));
    }
  };

  const handleTogglePrivacy = (id: number) => {
    setPrivacySettings(privacySettings.map(ps => 
      ps.id === id ? { ...ps, is_private: !ps.is_private } : ps
    ));
  };

  const handleSave = (privacySettingData: Omit<PrivacySetting, 'id'> | PrivacySetting) => {
    if ('id' in privacySettingData) {
      // Editing existing privacy setting
      setPrivacySettings(privacySettings.map(ps => 
        ps.id === privacySettingData.id ? privacySettingData : ps
      ));
    } else {
      // Adding new privacy setting
      const newPrivacySetting: PrivacySetting = {
        ...privacySettingData,
        id: Math.max(...privacySettings.map(ps => ps.id), 0) + 1
      };
      setPrivacySettings([...privacySettings, newPrivacySetting]);
    }
    setShowForm(false);
    setEditingPrivacySetting(undefined);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPrivacySetting(undefined);
  };

  return (
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
        <PrivacySettingsList
          privacySettings={privacySettings}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onTogglePrivacy={handleTogglePrivacy}
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
  );
};

export default PrivacySettingsManager;
