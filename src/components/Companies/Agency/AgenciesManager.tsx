"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Agency, Company } from "@/types/company";
import AgencyList from "./AgencyList";
import AgencyModal from "./AgencyModal";
import AgencyViewModal from "./AgencyViewModal";
import AgencySearchForm from "./AgencySearchForm";
import CommentsModal from "@/components/common/CommentsModal";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import { useConfirmation } from "@/hooks/useConfirmation";

export default function AgenciesManager() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [filteredAgencies, setFilteredAgencies] = useState<Agency[]>([]);
  const [editingAgency, setEditingAgency] = useState<Agency | null>(null);
  const [viewingAgency, setViewingAgency] = useState<Agency | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [commentsAgency, setCommentsAgency] = useState<Agency | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchFilters, setSearchFilters] = useState({
    companyName: '',
    market: '',
    unions: ''
  });
  
  // Loading states for specific operations
  const [deleting, setDeleting] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [searching, setSearching] = useState(false);
  
  const { confirm, confirmationProps } = useConfirmation();

  const loadAgencies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/agencies');
      if (!response.ok) {
        throw new Error('Failed to fetch agencies');
      }
      const data = await response.json();
      setAgencies(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load agencies');
    } finally {
      setLoading(false);
    }
  }, []);

  const filterAgencies = useCallback(() => {
    let filtered = agencies;

    // Filter by company name
    if (searchFilters.companyName) {
      filtered = filtered.filter(agency =>
        (agency as any).company_name?.toLowerCase().includes(searchFilters.companyName.toLowerCase())
      );
    }

    // Filter by market
    if (searchFilters.market) {
      filtered = filtered.filter(agency =>
        agency.market?.toLowerCase().includes(searchFilters.market.toLowerCase())
      );
    }

    // Filter by unions
    if (searchFilters.unions) {
      filtered = filtered.filter(agency =>
        agency.unions?.toLowerCase().includes(searchFilters.unions.toLowerCase())
      );
    }

    setFilteredAgencies(filtered);
  }, [agencies, searchFilters]);

  const handleAdd = () => {
    setEditingAgency(null);
    setShowFormModal(true);
  };

  const handleView = (agency: Agency) => {
    setViewingAgency(agency);
    setShowViewModal(true);
  };

  const handleEdit = (agency: Agency) => {
    setEditingAgency(agency);
    setShowFormModal(true);
  };

  const handleComments = (agency: Agency) => {
    setCommentsAgency(agency);
    setShowCommentsModal(true);
  };

  const handleDelete = async (agencyNo: number) => {
    const confirmed = await confirm(
      'Are you sure you want to delete this agency?\nThis action cannot be undone.',
      {
        title: 'Delete Agency',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        variant: 'danger'
      }
    );

    if (confirmed) {
      try {
        setDeleting(prev => [...prev, agencyNo]);
        const response = await fetch(`/api/agencies/${agencyNo}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete agency');
        }
        
        await loadAgencies();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete agency');
      } finally {
        setDeleting(prev => prev.filter(id => id !== agencyNo));
      }
    }
  };

  const handleSave = async (agencyData: Omit<Agency, 'agency_no'>) => {
    try {
      setSaving(true);
      
      if (editingAgency) {
        // Update existing agency
        const response = await fetch(`/api/agencies/${editingAgency.agency_no}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(agencyData),
        });
        
        if (!response.ok) {
          throw new Error('Failed to update agency');
        }
      } else {
        // Create new agency
        const response = await fetch('/api/agencies', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(agencyData),
        });
        
        if (!response.ok) {
          throw new Error('Failed to create agency');
        }
      }
      
      setShowFormModal(false);
      setEditingAgency(null);
      await loadAgencies();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save agency');
    } finally {
      setSaving(false);
    }
  };

  const handleSearch = async (filters: { companyName: string; market: string; unions: string }) => {
    try {
      setSearching(true);
      setSearchFilters(filters);
      
      if (filters.companyName.trim() === '' && filters.market.trim() === '' && filters.unions.trim() === '') {
        await loadAgencies();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search agencies');
    } finally {
      setSearching(false);
    }
  };

  const handleCancel = () => {
    setShowFormModal(false);
    setEditingAgency(null);
  };

  const handleToggleSearch = () => {
    setShowSearchForm(!showSearchForm);
  };

  // Effects
  useEffect(() => {
    loadAgencies();
  }, [loadAgencies]);

  useEffect(() => {
    filterAgencies();
  }, [agencies, searchFilters, filterAgencies]);

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
          Agencies Management
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
            Add Agency
          </button>
        </div>
      </div>

      {/* Search Form */}
      {showSearchForm && (
        <div className="mb-6">
          <AgencySearchForm
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

      <AgencyList
        agencies={filteredAgencies}
        onView={handleView}
        onEdit={handleEdit}
        onComments={handleComments}
        onDelete={handleDelete}
        deleting={deleting}
      />

      {/* Modals */}
      <AgencyModal
        isOpen={showFormModal}
        onClose={handleCancel}
        agency={editingAgency}
        onSave={handleSave}
        saving={saving}
      />

      <AgencyViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        agency={viewingAgency}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Comments Modal */}
      {commentsAgency && (
        <CommentsModal
          isOpen={showCommentsModal}
          onClose={() => setShowCommentsModal(false)}
          entityType="Agency"
          entityNo={commentsAgency.agency_no}
          entityName={`Agency #${commentsAgency.agency_no}`}
        />
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog {...confirmationProps} />
    </div>
  );
}
