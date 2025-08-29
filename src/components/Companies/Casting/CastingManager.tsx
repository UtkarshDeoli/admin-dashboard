"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Casting } from "@/types/company";
import CommentsModal from "@/components/common/CommentsModal";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import { useConfirmation } from "@/hooks/useConfirmation";
import CastingList from "./CastingList";
import CastingModal from "./CastingModal";
import CastingViewModal from "./CastingViewModal";
import CastingSearchForm from "./CastingSearchForm";

export default function CastingManager() {
  const [castings, setCastings] = useState<Casting[]>([]);
  const [filteredCastings, setFilteredCastings] = useState<Casting[]>([]);
  const [editingCasting, setEditingCasting] = useState<Casting | null>(null);
  const [viewingCasting, setViewingCasting] = useState<Casting | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [commentsCasting, setCommentsCasting] = useState<Casting | null>(null);
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

  const loadCastings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/casting');
      if (!response.ok) {
        throw new Error('Failed to fetch casting companies');
      }
      const data = await response.json();
      setCastings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load casting companies');
    } finally {
      setLoading(false);
    }
  }, []);

  const filterCastings = useCallback(() => {
    let filtered = castings;

    // Filter by company name
    if (searchFilters.companyName) {
      filtered = filtered.filter(casting =>
        (casting as any).company_name?.toLowerCase().includes(searchFilters.companyName.toLowerCase())
      );
    }

    // Filter by market
    if (searchFilters.market) {
      filtered = filtered.filter(casting =>
        casting.market?.toLowerCase().includes(searchFilters.market.toLowerCase())
      );
    }

    // Filter by unions
    if (searchFilters.unions) {
      filtered = filtered.filter(casting =>
        casting.unions?.toLowerCase().includes(searchFilters.unions.toLowerCase())
      );
    }

    setFilteredCastings(filtered);
  }, [castings, searchFilters]);

  const handleAdd = () => {
    setEditingCasting(null);
    setShowFormModal(true);
  };

  const handleView = (casting: Casting) => {
    setViewingCasting(casting);
    setShowViewModal(true);
  };

  const handleEdit = (casting: Casting) => {
    setEditingCasting(casting);
    setShowFormModal(true);
  };

  const handleComments = (casting: Casting) => {
    setCommentsCasting(casting);
    setShowCommentsModal(true);
  };

  const handleDelete = async (castingNo: number) => {
    const confirmed = await confirm(
      'Are you sure you want to delete this casting company?\nThis action cannot be undone.',
      {
        title: 'Delete Casting Company',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        variant: 'danger'
      }
    );

    if (confirmed) {
      try {
        setDeleting(prev => [...prev, castingNo]);
        const response = await fetch(`/api/casting/${castingNo}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete casting company');
        }
        
        await loadCastings();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete casting company');
      } finally {
        setDeleting(prev => prev.filter(id => id !== castingNo));
      }
    }
  };

  const handleSave = async (castingData: Omit<Casting, 'casting_company_no'>) => {
    try {
      setSaving(true);

      if (editingCasting) {
        // Update existing casting
        const response = await fetch(`/api/casting/${editingCasting.casting_company_no}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(castingData),
        });
        
        if (!response.ok) {
          throw new Error('Failed to update casting company');
        }
      } else {
        // Create new casting
        const response = await fetch('/api/casting', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(castingData),
        });
        
        if (!response.ok) {
          throw new Error('Failed to create casting company');
        }
      }
      
      setShowFormModal(false);
      setEditingCasting(null);
      await loadCastings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save casting company');
    } finally {
      setSaving(false);
    }
  };

  const handleSearch = async (filters: { companyName: string; market: string; unions: string }) => {
    try {
      setSearching(true);
      setSearchFilters(filters);
      
      if (filters.companyName.trim() === '' && filters.market.trim() === '' && filters.unions.trim() === '') {
        await loadCastings();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search casting companies');
    } finally {
      setSearching(false);
    }
  };

  const handleCancel = () => {
    setShowFormModal(false);
    setEditingCasting(null);
  };

  const handleToggleSearch = () => {
    setShowSearchForm(!showSearchForm);
  };

  // Effects
  useEffect(() => {
    loadCastings();
  }, [loadCastings]);

  useEffect(() => {
    filterCastings();
  }, [castings, searchFilters, filterCastings]);

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
          Casting Companies Management
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
            Add Casting Company
          </button>
        </div>
      </div>

      {/* Search Form */}
      {showSearchForm && (
        <div className="mb-6">
          <CastingSearchForm
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

      <CastingList
        castings={filteredCastings}
        onView={handleView}
        onEdit={handleEdit}
        onComments={handleComments}
        onDelete={handleDelete}
        deleting={deleting}
      />

      {/* Modals */}
      <CastingModal
        isOpen={showFormModal}
        onClose={handleCancel}
        casting={editingCasting}
        onSave={handleSave}
        saving={saving}
      />

      <CastingViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        casting={viewingCasting}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Comments Modal */}
      {commentsCasting && (
        <CommentsModal
          isOpen={showCommentsModal}
          onClose={() => setShowCommentsModal(false)}
          entityType="Casting"
          entityNo={commentsCasting.casting_company_no}
          entityName={`Casting #${commentsCasting.casting_company_no}`}
        />
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog {...confirmationProps} />
    </div>
  );
}
