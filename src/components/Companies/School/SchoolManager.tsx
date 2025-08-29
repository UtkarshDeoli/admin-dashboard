"use client";

import React, { useState, useEffect, useCallback } from "react";
import { School } from "@/types/company";
import CommentsModal from "@/components/common/CommentsModal";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import { useConfirmation } from "@/hooks/useConfirmation";
import SchoolList from "./SchoolList";
import SchoolModal from "./SchoolModal";
import SchoolViewModal from "./SchoolViewModal";
import SchoolSearchForm from "./SchoolSearchForm";

export default function SchoolManager() {
  const [schools, setSchools] = useState<School[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [viewingSchool, setViewingSchool] = useState<School | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [commentsSchool, setCommentsSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchFilters, setSearchFilters] = useState({
    companyName: '',
    technique: '',
    policy: ''
  });
  
  // Loading states for specific operations
  const [deleting, setDeleting] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [searching, setSearching] = useState(false);
  
  const { confirm, confirmationProps } = useConfirmation();

  const loadSchools = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/schools');
      if (!response.ok) {
        throw new Error('Failed to fetch schools');
      }
      const data = await response.json();
      setSchools(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load schools');
    } finally {
      setLoading(false);
    }
  }, []);

  const filterSchools = useCallback(() => {
    let filtered = schools;

    // Filter by company name
    if (searchFilters.companyName) {
      filtered = filtered.filter(school =>
        (school as any).company_name?.toLowerCase().includes(searchFilters.companyName.toLowerCase())
      );
    }

    // Filter by technique
    if (searchFilters.technique) {
      filtered = filtered.filter(school =>
        school.technique?.toLowerCase().includes(searchFilters.technique.toLowerCase())
      );
    }

    // Filter by policy
    if (searchFilters.policy) {
      filtered = filtered.filter(school =>
        school.policy?.toLowerCase().includes(searchFilters.policy.toLowerCase())
      );
    }

    setFilteredSchools(filtered);
  }, [schools, searchFilters]);

  const handleAdd = () => {
    setEditingSchool(null);
    setShowFormModal(true);
  };

  const handleView = (school: School) => {
    setViewingSchool(school);
    setShowViewModal(true);
  };

  const handleEdit = (school: School) => {
    setEditingSchool(school);
    setShowFormModal(true);
  };

  const handleComments = (school: School) => {
    setCommentsSchool(school);
    setShowCommentsModal(true);
  };

  const handleDelete = async (schoolNo: number) => {
    const confirmed = await confirm(
      'Are you sure you want to delete this school?\nThis action cannot be undone.',
      {
        title: 'Delete School',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        variant: 'danger'
      }
    );

    if (confirmed) {
      try {
        setDeleting(prev => [...prev, schoolNo]);
        const response = await fetch(`/api/schools/${schoolNo}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete school');
        }
        
        await loadSchools();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete school');
      } finally {
        setDeleting(prev => prev.filter(id => id !== schoolNo));
      }
    }
  };

  const handleSave = async (schoolData: Omit<School, 'school_no'>) => {
    try {
      setSaving(true);
      
      if (editingSchool) {
        // Update existing school
        const response = await fetch(`/api/schools/${editingSchool.school_no}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(schoolData),
        });
        
        if (!response.ok) {
          throw new Error('Failed to update school');
        }
      } else {
        // Create new school
        const response = await fetch('/api/schools', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(schoolData),
        });
        
        if (!response.ok) {
          throw new Error('Failed to create school');
        }
      }
      
      setShowFormModal(false);
      setEditingSchool(null);
      await loadSchools();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save school');
    } finally {
      setSaving(false);
    }
  };

  const handleSearch = async (filters: { companyName: string; technique: string; policy: string }) => {
    try {
      setSearching(true);
      setSearchFilters(filters);
      
      if (filters.companyName.trim() === '' && filters.technique.trim() === '' && filters.policy.trim() === '') {
        await loadSchools();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search schools');
    } finally {
      setSearching(false);
    }
  };

  const handleCancel = () => {
    setShowFormModal(false);
    setEditingSchool(null);
  };

  const handleToggleSearch = () => {
    setShowSearchForm(!showSearchForm);
  };

  // Effects
  useEffect(() => {
    loadSchools();
  }, [loadSchools]);

  useEffect(() => {
    filterSchools();
  }, [schools, searchFilters, filterSchools]);

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
          Schools Management
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
            Add School
          </button>
        </div>
      </div>

      {/* Search Form */}
      {showSearchForm && (
        <div className="mb-6">
          <SchoolSearchForm
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

      <SchoolList
        schools={filteredSchools}
        onView={handleView}
        onEdit={handleEdit}
        onComments={handleComments}
        onDelete={handleDelete}
        deleting={deleting}
      />

      {/* Modals */}
      <SchoolModal
        isOpen={showFormModal}
        onClose={handleCancel}
        school={editingSchool}
        onSave={handleSave}
        saving={saving}
      />

      <SchoolViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        school={viewingSchool}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Comments Modal */}
      {commentsSchool && (
        <CommentsModal
          isOpen={showCommentsModal}
          onClose={() => setShowCommentsModal(false)}
          entityType="School"
          entityNo={commentsSchool.school_no}
          entityName={`School #${commentsSchool.school_no}`}
        />
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog {...confirmationProps} />
    </div>
  );
}
