"use client";

import React, { useState, useEffect, useCallback } from "react";
import { RentalStudio } from "@/types/company";
import CommentsModal from "@/components/common/CommentsModal";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import { useConfirmation } from "@/hooks/useConfirmation";
import AgencySearchForm from "../AgencySearchForm";
import RentalStudioList from "./RentalStudioList";
import RentalStudioModal from "./RentalStudioModal";
import RentalStudioViewModal from "./RentalStudioViewModal";

export default function RentalStudioManager() {
  const [ rentalStudios, setRentalStudios] = useState<RentalStudio[]>([]);
  const [filteredRentalStudios, setFilteredRentalStudios] = useState<RentalStudio[]>([]);
  const [editingRentalStudio, setEditingRentalStudio] = useState<RentalStudio | null>(null);
  const [viewingRentalStudio, setViewingRentalStudio] = useState<RentalStudio | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [commentsRentalStudio, setCommentsRentalStudio] = useState<RentalStudio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchFilters, setSearchFilters] = useState({
    name: '',
    num_studios: '',
    rate: '',
    rate_frequency: ''

  });
  
  // Loading states for specific operations
  const [deleting, setDeleting] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [searching, setSearching] = useState(false);
  
  const { confirm, confirmationProps } = useConfirmation();

  const loadRentalStudios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/rental-studios');
      if (!response.ok) {
        throw new Error('Failed to fetch rental studios');
      }
      const data = await response.json();
      setRentalStudios(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load rental studios');
    } finally {
      setLoading(false);
    }
  }, []);

  const filterRentalStudios = useCallback(() => {
    let filtered = rentalStudios;

    // Filter by name
    if (searchFilters.name) {
      filtered = filtered.filter(rentalStudio =>
        (rentalStudio as any).name?.toLowerCase().includes(searchFilters.name.toLowerCase())
      );
    }

    // Filter by num_studios
    if (searchFilters.num_studios) {
      filtered = filtered.filter(rentalStudio =>
        rentalStudio.num_studios?.toString().includes(searchFilters.num_studios)
      );
    }

    // Filter by rate
    if (searchFilters.rate) {
      filtered = filtered.filter(rentalStudio =>
        rentalStudio.rate?.toString().includes(searchFilters.rate)
      );
    }

    // Filter by rate_frequency
    if (searchFilters.rate_frequency) {
      filtered = filtered.filter(rentalStudio =>
        rentalStudio.rate_frequency?.toString().includes(searchFilters.rate_frequency)
      );
    }

    setFilteredRentalStudios(filtered);
  }, [rentalStudios, searchFilters]);

  const handleAdd = () => {
    setEditingRentalStudio(null);
    setShowFormModal(true);
  };

  const handleView = (rentalStudio: RentalStudio) => {
    setViewingRentalStudio(rentalStudio);
    setShowViewModal(true);
  };

  const handleEdit = (rentalStudio: RentalStudio) => {
    setEditingRentalStudio(rentalStudio);
    setShowFormModal(true);
  };

  const handleComments = (rentalStudio: RentalStudio) => {
    setCommentsRentalStudio(rentalStudio);
    setShowCommentsModal(true);
  };

  const handleDelete = async (rentalStudioNo: number) => {
    const confirmed = await confirm(
      'Are you sure you want to delete this rental studio?\nThis action cannot be undone.',
      {
        title: 'Delete Rental Studio',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        variant: 'danger'
      }
    );

    if (confirmed) {
      try {
        setDeleting(prev => [...prev, rentalStudioNo]);
        const response = await fetch(`/api/rental-studios/${rentalStudioNo}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete rental studio');
        }

        await loadRentalStudios();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete rental studio');
      } finally {
        setDeleting(prev => prev.filter(id => id !== rentalStudioNo));
      }
    }
  };

  const handleSave = async (rentalStudioData: Omit<RentalStudio, 'studio_no'>) => {
    try {
      setSaving(true);

      if (editingRentalStudio) {
        // Update existing rental studio
        const response = await fetch(`/api/rental-studios/${editingRentalStudio.studio_no}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(rentalStudioData),
        });
        
        if (!response.ok) {
          throw new Error('Failed to update rental studio');
        }
      } else {
        // Create new rental studio
        const response = await fetch('/api/rental-studios', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(rentalStudioData),
        });
        
        if (!response.ok) {
          throw new Error('Failed to create rental studio');
        }
      }
      
      setShowFormModal(false);
      setEditingRentalStudio(null);
      await loadRentalStudios();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save rental studio');
    } finally {
      setSaving(false);
    }
  };

  const handleSearch = async (filters: { name: string; num_studios: string; rate: string; rate_frequency: string }) => {
    try {
      setSearching(true);
      setSearchFilters(filters);

      if (filters.name.trim() === '' && filters.num_studios.trim() === '' && filters.rate.trim() === '' && filters.rate_frequency.trim() === '') {
        await loadRentalStudios();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search rental studios');
    } finally {
      setSearching(false);
    }
  };

  const handleCancel = () => {
    setShowFormModal(false);
    setEditingRentalStudio(null);
  };

  const handleToggleSearch = () => {
    setShowSearchForm(!showSearchForm);
  };

  // Effects
  useEffect(() => {
    loadRentalStudios();
  }, [loadRentalStudios]);

  useEffect(() => {
    filterRentalStudios();
  }, [rentalStudios, searchFilters, filterRentalStudios]);

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
      {/* {showSearchForm && (
        <div className="mb-6">
          <AgencySearchForm
            onSearch={handleSearch}
            defaultFilters={searchFilters}
            searching={searching}
          />
        </div>
      )} */}

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

      <RentalStudioList
        rentalStudios={filteredRentalStudios}
        onView={handleView}
        onEdit={handleEdit}
        onComments={handleComments}
        onDelete={handleDelete}
        deleting={deleting}
      />

      {/* Modals */}
      <RentalStudioModal
        isOpen={showFormModal}
        onClose={handleCancel}
        rentalStudio={editingRentalStudio}
        onSave={handleSave}
        saving={saving}
      />

      <RentalStudioViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        rentalStudio={viewingRentalStudio}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Comments Modal */}
      { commentsRentalStudio && (
        <CommentsModal
          isOpen={showCommentsModal}
          onClose={() => setShowCommentsModal(false)}
          entityType="RentalStudio"
          entityNo={commentsRentalStudio.studio_no}
          entityName={`RentalStudio #${commentsRentalStudio.studio_no}`}
        />
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog {...confirmationProps} />
    </div>
  );
}
