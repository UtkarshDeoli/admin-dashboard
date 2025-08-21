"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Company } from "@/types/company";
import { companiesAPI } from "@/lib/api";
import CompanyList from "./CompanyList";
import CompanyModal from "./CompanyModal";
import CompanyViewModal from "./CompanyViewModal";
import CompanySearchForm from "./CompanySearchForm";
import CommentsModal from "@/components/common/CommentsModal";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import { useConfirmation } from "@/hooks/useConfirmation";
import { useRouter } from "next/navigation";

interface CompaniesManagerProps {
  companyType?: string;
}

export default function CompaniesManager({ companyType = 'All' }: CompaniesManagerProps) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [viewingCompany, setViewingCompany] = useState<Company | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [commentsCompany, setCommentsCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchFilters, setSearchFilters] = useState({
    name: '',
    companyType: companyType === 'All' ? '' : companyType
  });
  
  // Loading states for specific operations
  const [deleting, setDeleting] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [searching, setSearching] = useState(false);
  
  const { confirm, confirmationProps } = useConfirmation();
  const router = useRouter();

  const loadCompanies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data: Company[];
      if (companyType === 'All') {
        data = await companiesAPI.getAll();
      } else {
        data = await companiesAPI.getByType(companyType);
      }
      
      setCompanies(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load companies');
    } finally {
      setLoading(false);
    }
  }, [companyType]);

  const filterCompanies = useCallback(() => {
    let filtered = companies;

    // TODO: Update company type filtering to work with dynamic type detection
    // For now, we'll skip type filtering since company_type is no longer a direct field
    // if (searchFilters.companyType && searchFilters.companyType !== 'All') {
    //   filtered = filtered.filter(company => 
    //     company.company_type === searchFilters.companyType
    //   );
    // }

    // Filter by name
    if (searchFilters.name) {
      filtered = filtered.filter(company =>
        company.name.toLowerCase().includes(searchFilters.name.toLowerCase()) ||
        company.description?.toLowerCase().includes(searchFilters.name.toLowerCase()) ||
        company.fka?.toLowerCase().includes(searchFilters.name.toLowerCase()) ||
        company.acronym?.toLowerCase().includes(searchFilters.name.toLowerCase())
      );
    }

    setFilteredCompanies(filtered);
  }, [companies, searchFilters]);

  const handleAdd = () => {
    setEditingCompany(null);
    setShowFormModal(true);
  };

  const handleView = (company: Company) => {
    setViewingCompany(company);
    setShowViewModal(true);
  };

  const handleEdit = (company: Company) => {
    console.log('Editing company:', company);
    router.push(`/companies/${company.company_no}/edit`);
  };

  const handleComments = (company: Company) => {
    setCommentsCompany(company);
    setShowCommentsModal(true);
  };

  const handleDelete = async (companyNo: number) => {
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
        setDeleting(prev => [...prev, companyNo]);
        await companiesAPI.delete(companyNo);
        await loadCompanies();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete company');
      } finally {
        setDeleting(prev => prev.filter(id => id !== companyNo));
      }
    }
  };

  const handleSave = async (companyData: Omit<Company, 'company_no' | 'created_at' | 'updated_at'>) => {
    try {
      setSaving(true);
      let savedCompany: Company;
      
      if (editingCompany) {
        savedCompany = await companiesAPI.update(editingCompany.company_no, companyData);
      } else {
        savedCompany = await companiesAPI.create(companyData);
      }
      
      setShowFormModal(false);
      setEditingCompany(null);
      await loadCompanies();
      
      // Post-creation workflow: redirect to edit page
      if (!editingCompany) {
        router.push(`/companies/${savedCompany.company_no}/edit`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save company');
    } finally {
      setSaving(false);
    }
  };

  const handleSearch = async (filters: { name: string; companyType: string }) => {
    try {
      setSearching(true);
      setSearchFilters(filters);
      
      if (filters.name.trim() === '' && filters.companyType === '') {
        await loadCompanies();
      } else {
        const results = await companiesAPI.search(filters.name, filters.companyType || undefined);
        setCompanies(results);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search companies');
    } finally {
      setSearching(false);
    }
  };

  const handleCancel = () => {
    setShowFormModal(false);
    setEditingCompany(null);
  };

  const handleToggleSearch = () => {
    setShowSearchForm(!showSearchForm);
  };

  // Effects
  useEffect(() => {
    loadCompanies();
  }, [companyType, loadCompanies]);

  useEffect(() => {
    filterCompanies();
  }, [companies, searchFilters, filterCompanies]);

  if (loading) {
    return (
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          {companyType === 'All' ? 'Companies Management' : `${companyType} Management`}
        </h4>
        <div className="flex gap-3">
          <button
            onClick={handleToggleSearch}
            className={`flex items-center justify-center rounded px-6 py-2 font-medium text-white transition ${
              showSearchForm 
                ? 'bg-secondary hover:bg-opacity-90' 
                : 'bg-meta-3 hover:bg-opacity-90'
            }`}
          >
            {showSearchForm ? 'Hide Search' : 'Show Search'}
          </button>
          <button
            onClick={handleAdd}
            className="flex items-center justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
          >
            Add {companyType === 'All' ? 'Company' : companyType.slice(0, -1)}
          </button>
        </div>
      </div>

      {/* Search Form */}
      {showSearchForm && (
        <div className="mb-6">
          <CompanySearchForm
            onSearch={handleSearch}
            defaultFilters={searchFilters}
            searching={searching}
          />
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-sm border border-danger bg-danger bg-opacity-10 px-4 py-3 text-danger">
          <p>{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-sm underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <CompanyList
        companies={filteredCompanies}
        onView={handleView}
        onEdit={handleEdit}
        onComments={handleComments}
        onDelete={handleDelete}
        deleting={deleting}
      />

      {/* Modals */}
      {/* <CompanyModal
        isOpen={showFormModal}
        onClose={handleCancel}
        company={editingCompany}
        onSave={handleSave}
        saving={saving}
        defaultCompanyType={companyType === 'All' ? '' : companyType}
      /> */}

      <CompanyViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        company={viewingCompany}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Comments Modal */}
      {commentsCompany && (
        <CommentsModal
          isOpen={showCommentsModal}
          onClose={() => setShowCommentsModal(false)}
          entityType="Company"
          entityNo={commentsCompany.company_no}
          entityName={commentsCompany.name}
        />
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog {...confirmationProps} />
    </div>
  );
}
