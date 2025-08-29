"use client";

import React, { useState, useEffect, useCallback } from "react";
import { RentalSpace } from "@/types/company";
import RentalSpaceSearchForm from "./RentalSpaceSearchForm";
import CommentsModal from "@/components/common/CommentsModal";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import { useConfirmation } from "@/hooks/useConfirmation";
import RentalSpaceList from "./RentalSpaceList";
import RentalSpaceModal from "./RentalSpaceModal";
import RentalSpaceViewModal from "./RentalSpaceViewModal";

export default function RentalSpaceManager() {
  const [rentalSpaces, setRentalSpaces] = useState<RentalSpace[]>([]);
  const [filteredRentalSpaces, setFilteredRentalSpaces] = useState<RentalSpace[]>([]);
  const [editingRentalSpace, setEditingRentalSpace] = useState<RentalSpace | null>(null);
  const [viewingRentalSpace, setViewingRentalSpace] = useState<RentalSpace | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [commentsRentalSpace, setCommentsRentalSpace] = useState<RentalSpace | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchFilters, setSearchFilters] = useState({
    companyName: '',
    spaceType: '',
    dimensions: ''
  });
  
  // Loading states for specific operations
  const [deleting, setDeleting] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [searching, setSearching] = useState(false);
  
  const { confirm, confirmationProps } = useConfirmation();

  const loadRentalSpaces = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/rental-spaces');
      if (!response.ok) {
        throw new Error('Failed to fetch rental spaces');
      }
      const data = await response.json();
      setRentalSpaces(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load rental spaces');
    } finally {
      setLoading(false);
    }
  }, []);

  const filterRentalSpaces = useCallback(() => {
    let filtered = rentalSpaces;

    // Filter by company name
    if (searchFilters.companyName) {
      filtered = filtered.filter(rentalSpace =>
        (rentalSpace as any).company_name?.toLowerCase().includes(searchFilters.companyName.toLowerCase())
      );
    }

    // Filter by space type
    if (searchFilters.spaceType) {
      filtered = filtered.filter(rentalSpace =>
        rentalSpace.space_type?.toLowerCase().includes(searchFilters.spaceType.toLowerCase())
      );
    }

    // Filter by dimensions
    if (searchFilters.dimensions) {
      filtered = filtered.filter(rentalSpace =>
        rentalSpace.dimensions?.toLowerCase().includes(searchFilters.dimensions.toLowerCase())
      );
    }

    setFilteredRentalSpaces(filtered);
  }, [rentalSpaces, searchFilters]);

  const handleAdd = () => {
    setEditingRentalSpace(null);
    setShowFormModal(true);
  };

  const handleView = (rentalSpace: RentalSpace) => {
    setViewingRentalSpace(rentalSpace);
    setShowViewModal(true);
  };

  const handleEdit = (rentalSpace: RentalSpace) => {
    setEditingRentalSpace(rentalSpace);
    setShowFormModal(true);
  };

  const handleComments = (rentalSpace: RentalSpace) => {
    setCommentsRentalSpace(rentalSpace);
    setShowCommentsModal(true);
  };

  const handleDelete = async (rentalSpaceNo: number) => {
    const confirmed = await confirm(
      'Are you sure you want to delete this rental space?\nThis action cannot be undone.',
      {
        title: 'Delete Rental Space',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        variant: 'danger'
      }
    );

    if (confirmed) {
      try {
        setDeleting(prev => [...prev, rentalSpaceNo]);
        const response = await fetch(`/api/rental-spaces/${rentalSpaceNo}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete rental space');
        }

        await loadRentalSpaces();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete rental space');
      } finally {
        setDeleting(prev => prev.filter(id => id !== rentalSpaceNo));
      }
    }
  };

  const handleSave = async (rentalSpaceData: Omit<RentalSpace, 'space_no'>) => {
    try {
      setSaving(true);

      if (editingRentalSpace) {
        // Update existing rental space
        const response = await fetch(`/api/rental-spaces/${editingRentalSpace.space_no}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(rentalSpaceData),
        });
        
        if (!response.ok) {
          throw new Error('Failed to update rental space');
        }
      } else {
        // Create new rental space
        const response = await fetch('/api/rental-spaces', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(rentalSpaceData),
        });
        
        if (!response.ok) {
          throw new Error('Failed to create rental space');
        }
      }
      
      setShowFormModal(false);
      setEditingRentalSpace(null);
      await loadRentalSpaces();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save rental space');
    } finally {
      setSaving(false);
    }
  };

  const handleSearch = async (filters: { companyName: string; spaceType: string; dimensions: string }) => {
    try {
      setSearching(true);
      setSearchFilters(filters);

      if (filters.companyName.trim() === '' && filters.spaceType.trim() === '' && filters.dimensions.trim() === '') {
        await loadRentalSpaces();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search rental spaces');
    } finally {
      setSearching(false);
    }
  };

  const handleCancel = () => {
    setShowFormModal(false);
    setEditingRentalSpace(null);
  };

  const handleToggleSearch = () => {
    setShowSearchForm(!showSearchForm);
  };

  // Effects
  useEffect(() => {
    loadRentalSpaces();
  }, [loadRentalSpaces]);

  useEffect(() => {
    filterRentalSpaces();
  }, [rentalSpaces, searchFilters, filterRentalSpaces]);

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
          Rental Spaces Management
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
            Add Rental Space
          </button>
        </div>
      </div>

      {/* Search Form */}
      {showSearchForm && (
        <div className="mb-6">
          <RentalSpaceSearchForm
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

      <RentalSpaceList
        rentalSpaces={filteredRentalSpaces}
        onView={handleView}
        onEdit={handleEdit}
        onComments={handleComments}
        onDelete={handleDelete}
        deleting={deleting}
      />

      {/* Modals */}
      <RentalSpaceModal
        isOpen={showFormModal}
        onClose={handleCancel}
        rentalSpaces={editingRentalSpace}
        onSave={handleSave}
        saving={saving}
      />

      <RentalSpaceViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        rentalSpace={viewingRentalSpace}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Comments Modal */}
      {commentsRentalSpace && (
        <CommentsModal
          isOpen={showCommentsModal}
          onClose={() => setShowCommentsModal(false)}
          entityType="RentalSpace"
          entityNo={commentsRentalSpace.space_no}
          entityName={`Rental Space #${commentsRentalSpace.space_no}`}
        />
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog {...confirmationProps} />
    </div>
  );
}
