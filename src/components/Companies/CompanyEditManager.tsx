"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Company } from "@/types/company";
import { companiesAPI } from "@/lib/api";
import CompanyForm from "./CompanyForm";
import AgencyForm from "./Agency/AgencyForm";
import CastingForm from "./Casting/CastingForm";
import RentalSpaceForm from "./Rental-Spaces/RentalSpaceForm";
import TheaterForm from "./Theater/TheaterForm";
import RentalStudioForm from "./Rental-Studios/RentalStudioForm";
import SchoolForm from "./School/SchoolForm";
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
  const [companyTypes, setCompanyTypes] = useState<string[]>([]);
  const [typeDataStatus, setTypeDataStatus] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'type-specific' | 'addresses'>('basic');
  const [activeTypeTab, setActiveTypeTab] = useState<string>('');
  const [addingType, setAddingType] = useState(false);
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
      
      // Load company types (multiple types supported)
      const typesResponse = await fetch(`/api/companies/${companyId}/types`);
      if (!typesResponse.ok) {
        throw new Error('Failed to fetch company types');
      }
      const typesData = await typesResponse.json();
      setCompanyTypes(typesData.companyTypes || []);
      setTypeDataStatus(typesData.typeDataStatus || {});
      
      // Set the first type as active if we have types
      if (typesData.companyTypes && typesData.companyTypes.length > 0) {
        setActiveTypeTab(typesData.companyTypes[0]);
      }
      
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

  const handleAddType = async (newType: string) => {
    if (companyTypes.includes(newType)) return;

    const confirmed = await confirm(
      `Are you sure you want to add ${newType} type to this company?\nThis will create new ${newType}-specific records.`,
      {
        title: 'Add Company Type',
        confirmText: 'Add Type',
        cancelText: 'Cancel',
        variant: 'warning'
      }
    );

    if (confirmed) {
      try {
        setAddingType(true);
        setError(null);
        
        const response = await fetch(`/api/companies/${companyId}/types`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ typeToAdd: newType }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to add company type');
        }
        
        const result = await response.json();
        console.log('Add type result:', result);
        
        await loadCompany();
        console.log('Company types after adding:', companyTypes);
        setActiveTab('type-specific');
        setActiveTypeTab(newType);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to add company type');
      } finally {
        setAddingType(false);
      }
    }
  };

  const handleRemoveType = async (typeToRemove: string) => {
    const confirmed = await confirm(
      `Are you sure you want to remove ${typeToRemove} type from this company?\nThis will archive all ${typeToRemove}-specific data.`,
      {
        title: 'Remove Company Type',
        confirmText: 'Remove Type',
        cancelText: 'Cancel',
        variant: 'danger'
      }
    );

    if (confirmed) {
      try {
        setAddingType(true);
        setError(null);
        
        const response = await fetch(`/api/companies/${companyId}/types?type=${encodeURIComponent(typeToRemove)}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to remove company type');
        }
        
        await loadCompany();
        
        // If we removed the active type tab, switch to the first available type or basic
        if (activeTypeTab === typeToRemove) {
          const remainingTypes = companyTypes.filter(t => t !== typeToRemove);
          if (remainingTypes.length > 0) {
            setActiveTypeTab(remainingTypes[0]);
          } else {
            setActiveTab('basic');
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to remove company type');
      } finally {
        setAddingType(false);
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

  const availableTypesToAdd = COMPANY_TYPES.filter(type => !companyTypes.includes(type));

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
              Company Types: {companyTypes.length > 0 ? companyTypes.join(', ') : 'None specified'}
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

        {/* Company Type Management */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h5 className="text-lg font-medium text-black dark:text-white mb-1">
                Company Types ({companyTypes.length})
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Add or remove company types. Each type enables specific features and forms.
              </p>
            </div>
          </div>
          
          {/* Current Types */}
          {companyTypes.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Types:</p>
              <div className="flex flex-wrap gap-2">
                {companyTypes.map((type) => (
                  <div key={type} className="flex items-center gap-2 bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-full">
                    <span className="text-sm font-medium">{type}</span>
                    <button
                      onClick={() => handleRemoveType(type)}
                      disabled={addingType}
                      className="text-danger hover:text-danger-dark disabled:opacity-50"
                      title={`Remove ${type} type`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Type */}
          {availableTypesToAdd.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Add Type:</p>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {availableTypesToAdd.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleAddType(type)}
                    disabled={addingType}
                    className="flex items-center justify-center rounded border border-stroke px-4 py-2 font-medium text-black hover:bg-gray-50 dark:border-strokedark dark:text-white dark:hover:bg-gray-800 disabled:opacity-50"
                  >
                    {addingType ? 'Adding...' : `+ ${type}`}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

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
            
            {companyTypes.length > 0 && (
              <button
                onClick={() => setActiveTab('type-specific')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'type-specific'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Type-Specific Details
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

      {activeTab === 'type-specific' && companyTypes.length > 0 && (
        <div className="space-y-6">
          {/* Type-specific tabs */}
          <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="border-b border-stroke dark:border-strokedark mb-6">
              <nav className="-mb-px flex space-x-8">
                {companyTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setActiveTypeTab(type)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTypeTab === type
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    {type} Details
                  </button>
                ))}
              </nav>
            </div>

            {/* Render the form for the active type */}
            {activeTypeTab && COMPANY_TYPE_FORMS[activeTypeTab as keyof typeof COMPANY_TYPE_FORMS] && (
              (() => {
                const TypeSpecificForm = COMPANY_TYPE_FORMS[activeTypeTab as keyof typeof COMPANY_TYPE_FORMS];
                return (
                  <TypeSpecificForm
                    companyId={companyId}
                    onSave={handleSaveTypeSpecific}
                  />
                );
              })()
            )}
          </div>
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
