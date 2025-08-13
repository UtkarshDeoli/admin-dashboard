"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Company } from "@/types/company";
import { companiesAPI } from "@/lib/api";
import CompanyForm from "./CompanyForm";
import AgencyForm from "./AgencyForm";
import CastingForm from "./CastingForm";
import RentalSpaceForm from "./RentalSpaceForm";
import TheaterForm from "./TheaterForm";
import RentalStudioForm from "./RentalStudioForm";
import SchoolForm from "./SchoolForm";
import CompanyAddressesManager from "./CompanyAddressesManager";
import CommentsModal from "@/components/common/CommentsModal";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import { useConfirmation } from "@/hooks/useConfirmation";

interface CompanyEditManagerProps {
  companyId: number;
}

const COMPANY_TYPE_FORMS = {
  'Agency': AgencyForm,
  'Casting': CastingForm,
  'Rental Space': RentalSpaceForm,
  'Theater': TheaterForm,
  'Rental Studio': RentalStudioForm,
  'School': SchoolForm,
};

const COMPANY_TYPES = ['Agency', 'Casting', 'Rental Space', 'Theater', 'Rental Studio', 'School'];

export default function CompanyEditManager({ companyId }: CompanyEditManagerProps) {
  const [company, setCompany] = useState<Company | null>(null);
  const [companyType, setCompanyType] = useState<string | null>(null);
  const [hasTypeData, setHasTypeData] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'type-specific' | 'addresses'>('basic');
  const [changingType, setChangingType] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  
  const { confirm, confirmationProps } = useConfirmation();
  const router = useRouter();

  const loadCompany = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load company data
      const data = await companiesAPI.getById(companyId);
      setCompany(data);
      
      // Load company type
      const typeData = await companiesAPI.getType(companyId);
      setCompanyType(typeData.companyType);
      setHasTypeData(typeData.hasData);
      setSelectedType(typeData.companyType || '');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load company');
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    loadCompany();
  }, [loadCompany]);

  const handleSaveBasic = async (updatedCompany: Omit<Company, "company_no">) => {
    try {
      setSaving(true);
      setError(null);
      await companiesAPI.update(companyId, updatedCompany);
      await loadCompany();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save company');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveTypeSpecific = async () => {
    await loadCompany();
  };

  const handleTypeChange = async (newType: string) => {
    if (newType === companyType) return;

    const confirmed = await confirm(
      `Are you sure you want to change the company type to ${newType}?\nThis will ${companyType ? 'archive existing data and create new records' : 'create new type-specific records'}.`,
      {
        title: 'Change Company Type',
        confirmText: 'Change Type',
        cancelText: 'Cancel',
        variant: 'warning'
      }
    );

    if (confirmed) {
      try {
        setChangingType(true);
        setError(null);
        
        await companiesAPI.changeType(companyId, newType, companyType || undefined);
        await loadCompany();
        setActiveTab('type-specific');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to change company type');
      } finally {
        setChangingType(false);
      }
    }
  };

  const handleDelete = async () => {
    const confirmed = await confirm(
      'Are you sure you want to delete this company?\nThis action cannot be undone and will also delete all associated data.',
      {
        title: 'Delete Company',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        variant: 'danger'
      }
    );

    if (confirmed) {
      try {
        setSaving(true);
        await companiesAPI.delete(companyId);
        router.push('/companies');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete company');
      } finally {
        setSaving(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="text-center text-red-500 py-8">
          <p>{error}</p>
          <button
            onClick={loadCompany}
            className="mt-4 rounded bg-primary px-6 py-2 font-medium text-white hover:bg-opacity-90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="text-center py-8">
          <p>Company not found</p>
        </div>
      </div>
    );
  }

  const TypeSpecificForm = companyType ? COMPANY_TYPE_FORMS[companyType as keyof typeof COMPANY_TYPE_FORMS] : null;

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="mb-2 text-xl font-semibold text-black dark:text-white">
              Edit Company: {company.name}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Company Type: {companyType || 'Not specified'}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowCommentsModal(true)}
              className="flex items-center justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:border-black dark:border-strokedark dark:text-white dark:hover:border-white"
            >
              View Comments
            </button>
            <button
              onClick={() => router.push('/companies')}
              className="flex items-center justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:border-black dark:border-strokedark dark:text-white dark:hover:border-white"
            >
              Back to Companies
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center justify-center rounded bg-danger px-6 py-2 font-medium text-white hover:bg-opacity-90"
              disabled={saving}
            >
              Delete Company
            </button>
          </div>
        </div>

        {/* Company Type Selector */}
        {!companyType && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg dark:bg-yellow-900/20 dark:border-yellow-800">
            <h5 className="text-lg font-medium text-black dark:text-white mb-3">
              Select Company Type
            </h5>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Choose the type of company to enable type-specific features and forms.
            </p>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {COMPANY_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => handleTypeChange(type)}
                  disabled={changingType}
                  className="flex items-center justify-center rounded border border-stroke px-4 py-2 font-medium text-black hover:bg-gray-50 dark:border-strokedark dark:text-white dark:hover:bg-gray-800 disabled:opacity-50"
                >
                  {changingType ? 'Setting...' : type}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Company Type Change Option */}
        {companyType && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-lg font-medium text-black dark:text-white mb-1">
                  Current Type: {companyType}
                </h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Change the company type to access different features and forms.
                </p>
              </div>
              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  if (e.target.value && e.target.value !== companyType) {
                    handleTypeChange(e.target.value);
                  }
                }}
                disabled={changingType}
                className="rounded border border-stroke px-4 py-2 text-black outline-none transition focus:border-primary dark:border-strokedark dark:bg-form-input dark:text-white"
              >
                {COMPANY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="border-b border-stroke dark:border-strokedark">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('basic')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'basic'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Basic Information
            </button>
            
            {companyType && TypeSpecificForm && (
              <button
                onClick={() => setActiveTab('type-specific')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'type-specific'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {companyType} Details
              </button>
            )}
            
            <button
              onClick={() => setActiveTab('addresses')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'addresses'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Addresses
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'basic' && (
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <CompanyForm
            company={company}
            onSave={handleSaveBasic}
            onCancel={() => router.push('/companies')}
            saving={saving}
          />
        </div>
      )}

      {activeTab === 'type-specific' && companyType && TypeSpecificForm && (
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <TypeSpecificForm
            companyId={companyId}
            onSave={handleSaveTypeSpecific}
          />
        </div>
      )}

      {activeTab === 'addresses' && (
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <CompanyAddressesManager companyId={companyId} />
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog {...confirmationProps} />

      {/* Comments Modal */}
      {company && (
        <CommentsModal
          isOpen={showCommentsModal}
          onClose={() => setShowCommentsModal(false)}
          entityType="Company"
          entityNo={companyId}
          entityName={company.name}
        />
      )}
    </div>
  );
}
