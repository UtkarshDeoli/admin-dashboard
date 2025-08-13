"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Person } from "@/types/company";
import { peopleAPI } from "@/lib/api";
import PersonForm from "./PersonForm";
import PersonAddressesManager from "./PersonAddressesManager";
import CommentsModal from "@/components/common/CommentsModal";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import { useConfirmation } from "@/hooks/useConfirmation";

interface PersonEditManagerProps {
  peopleId: number;
}

export default function PersonEditManager({ peopleId }: PersonEditManagerProps) {
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'addresses'>('basic');
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  
  const { confirm, confirmationProps } = useConfirmation();
  const router = useRouter();

  useEffect(() => {
    loadPerson();
  }, [peopleId]);

  const loadPerson = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await peopleAPI.getById(peopleId);
      setPerson(data);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load person');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBasic = async (updatedPerson: Omit<Person, "people_no">) => {
    try {
      setSaving(true);
      setError(null);
      await peopleAPI.update(peopleId, updatedPerson);
      await loadPerson();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save person');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = await confirm(
      'Are you sure you want to delete this person?\nThis action cannot be undone and will also delete all associated data.',
      {
        title: 'Delete Person',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        variant: 'danger'
      }
    );

    if (confirmed) {
      try {
        setSaving(true);
        await peopleAPI.delete(peopleId);
        router.push('/people');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete person');
      } finally {
        setSaving(false);
      }
    }
  };

  const handleComments = () => {
    setShowCommentsModal(true);
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

  if (!person) {
    return (
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="text-center py-8">
          <p className="text-red-500">Person not found</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 className="text-xl font-semibold text-black dark:text-white">
              {person.first_name} {person.middle_name && `${person.middle_name} `}{person.last_name}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Person ID: {person.people_no}
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleComments}
              className="flex items-center justify-center rounded bg-secondary px-4 py-2 font-medium text-white hover:bg-opacity-90"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              Comments
            </button>
            
            <button
              onClick={handleDelete}
              disabled={saving}
              className="flex items-center justify-center rounded bg-danger px-4 py-2 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 rounded-sm border border-danger bg-danger bg-opacity-10 px-4 py-3 text-danger">
            <p>{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-6 flex border-b border-stroke dark:border-strokedark">
          <button
            onClick={() => setActiveTab('basic')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'basic'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-600 hover:text-primary dark:text-gray-300'
            }`}
          >
            Basic Information
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'addresses'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-600 hover:text-primary dark:text-gray-300'
            }`}
          >
            Addresses
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'basic' && (
          <PersonForm
            person={person}
            onSave={handleSaveBasic}
            onCancel={() => router.push('/people')}
            saving={saving}
            isInline={true}
          />
        )}

        {activeTab === 'addresses' && (
          <PersonAddressesManager peopleId={peopleId} />
        )}
      </div>

      {/* Comments Modal */}
      {showCommentsModal && (
        <CommentsModal
          isOpen={showCommentsModal}
          entityType="People"
          entityNo={person.people_no}
          entityName={`${person.first_name} ${person.last_name}`}
          onClose={() => setShowCommentsModal(false)}
        />
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog {...confirmationProps} />
    </>
  );
}
