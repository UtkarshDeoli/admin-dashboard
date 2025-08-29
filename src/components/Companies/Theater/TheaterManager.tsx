"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Theater } from "@/types/company";
import CommentsModal from "@/components/common/CommentsModal";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import { useConfirmation } from "@/hooks/useConfirmation";
import TheaterList from "./TheaterList";
import TheaterModal from "./TheaterModal";
import TheaterViewModal from "./TheaterViewModal";
import TheaterSearchForm from "./TheaterSearchForm";

export default function TheaterManager() {
  const [theater, setTheater] = useState<Theater[]>([]);
  const [filteredTheater, setFilteredTheater] = useState<Theater[]>([]);
  const [editingTheater, setEditingTheater] = useState<Theater | null>(null);
  const [viewingTheater, setViewingTheater] = useState<Theater | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [commentsTheater, setCommentsTheater] = useState<Theater | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchFilters, setSearchFilters] = useState({
    companyName: '',
    contract: '',
    submissionPreference: '',
  });
  
  // Loading states for specific operations
  const [deleting, setDeleting] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [searching, setSearching] = useState(false);
  
  const { confirm, confirmationProps } = useConfirmation();

  const loadTheaters = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/theaters');
      if (!response.ok) {
        throw new Error('Failed to fetch agencies');
      }
      const data = await response.json();
      setTheater(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load agencies');
    } finally {
      setLoading(false);
    }
  }, []);

  const filterTheater = useCallback(() => {
    let filtered = theater;

    // Filter by company name
    if (searchFilters.companyName) {
      filtered = filtered.filter(casting =>
        (casting as any).company_name?.toLowerCase().includes(searchFilters.companyName.toLowerCase())
      );
    }

    // Filter by contract
    if (searchFilters.contract) {
      filtered = filtered.filter(theater =>
        theater.contract?.toLowerCase().includes(searchFilters.contract.toLowerCase())
      );
    }

    // Filter by submission preference
    if (searchFilters.submissionPreference) {
      filtered = filtered.filter(theater =>
        theater.submission_preference?.toLowerCase().includes(searchFilters.submissionPreference.toLowerCase())
      );
    }

    setFilteredTheater(filtered);
  }, [theater, searchFilters]);

  const handleAdd = () => {
    setEditingTheater(null);
    setShowFormModal(true);
  };

  const handleView = (theater: Theater) => {
    setViewingTheater(theater);
    setShowViewModal(true);
  };

  const handleEdit = (theater: Theater) => {
    setEditingTheater(theater);
    setShowFormModal(true);
  };

  const handleComments = (theater: Theater) => {
    setCommentsTheater(theater);
    setShowCommentsModal(true);
  };

  const handleDelete = async (theaterNo: number) => {
    const confirmed = await confirm(
      'Are you sure you want to delete this theater?\nThis action cannot be undone.',
      {
        title: 'Delete Theater',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        variant: 'danger'
      }
    );

    if (confirmed) {
      try {
        setDeleting(prev => [...prev, theaterNo]);
        const response = await fetch(`/api/theaters/${theaterNo}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete theater');
        }
        
        await loadTheaters();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete theater');
      } finally {
        setDeleting(prev => prev.filter(id => id !== theaterNo));
      }
    }
  };

  const handleSave = async (theaterData: Omit<Theater, 'theater_no'>) => {
    try {
      setSaving(true);

      if (editingTheater) {
        // Update existing theater
        const response = await fetch(`/api/theaters/${editingTheater.theater_no}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(theaterData),
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
          body: JSON.stringify(theaterData),
        });
        
        if (!response.ok) {
          throw new Error('Failed to create theater');
        }
      }
      
      setShowFormModal(false);
      setEditingTheater(null);
      await loadTheaters();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save theater');
    } finally {
      setSaving(false);
    }
  };

  const handleSearch = async (filters: { companyName: string; contract: string; submissionPreference: string }) => {
    try {
      setSearching(true);
      setSearchFilters(filters);

      if (filters.companyName.trim() === '' && filters.contract.trim() === '' && filters.submissionPreference.trim() === '') {
        await loadTheaters();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search theaters');
    } finally {
      setSearching(false);
    }
  };

  const handleCancel = () => {
    setShowFormModal(false);
    setEditingTheater(null);
  };

  const handleToggleSearch = () => {
    setShowSearchForm(!showSearchForm);
  };

  // Effects
  useEffect(() => {
    loadTheaters();
  }, [loadTheaters]);

  useEffect(() => {
    filterTheater();
  }, [theater, searchFilters, filterTheater]);

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
          <TheaterSearchForm
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

      <TheaterList
        theaters={filteredTheater}
        onView={handleView}
        onEdit={handleEdit}
        onComments={handleComments}
        onDelete={handleDelete}
        deleting={deleting}
      />

      {/* Modals */}
      <TheaterModal
        isOpen={showFormModal}
        onClose={handleCancel}
        theater={editingTheater}
        onSave={handleSave}
        saving={saving}
      />

      <TheaterViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        theater={viewingTheater}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Comments Modal */}
      {commentsTheater && (
        <CommentsModal
          isOpen={showCommentsModal}
          onClose={() => setShowCommentsModal(false)}
          entityType="Theater"
          entityNo={commentsTheater.theater_no}
          entityName={`Theater #${commentsTheater.theater_no}`}
        />
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog {...confirmationProps} />
    </div>
  );
}
