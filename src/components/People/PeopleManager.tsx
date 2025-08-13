"use client";

import React, { useState, useEffect } from "react";
import { Person } from "@/types/company";
import { peopleAPI } from "@/lib/api";
import PersonList from "./PersonList";
import PersonForm from "./PersonForm";
import PersonViewModal from "./PersonViewModal";
import CommentsModal from "@/components/common/CommentsModal";
import { useConfirmation } from "@/hooks/useConfirmation";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";

export default function PeopleManager() {
  const [people, setPeople] = useState<Person[]>([]);
  const [editingPerson, setEditingPerson] = useState<Person | undefined>(undefined);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [commentsPerson, setCommentsPerson] = useState<Person | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewPerson, setViewPerson] = useState<Person | null>(null);
  const { confirm, confirmationProps } = useConfirmation();

  useEffect(() => {
    loadPeople();
  }, []);

  // Filter people based on search term
  const filteredPeople = people.filter(
    (person) =>
      person.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.middle_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const loadPeople = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await peopleAPI.getAll();
      setPeople(data);
    } catch (err) {
      setError('Failed to load people');
      console.error('Error loading people:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingPerson(undefined);
    setShowForm(true);
  };

  const handleEdit = (person: Person) => {
    setEditingPerson(person);
    setShowForm(true);
  };

  const handleSave = async (personData: Omit<Person, "people_no">) => {
    try {
      setSaving(true);
      if (editingPerson) {
        // Update existing person
        await peopleAPI.update(editingPerson.people_no, personData);
      } else {
        // Create new person
        await peopleAPI.create(personData);
      }
      setShowForm(false);
      setEditingPerson(undefined);
      await loadPeople();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save person');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (peopleNo: number) => {
    const confirmed = await confirm(
      'Are you sure you want to delete this person? This action cannot be undone.',
      {
        title: 'Delete Person',
        confirmText: 'Delete',
        cancelText: 'Cancel',
      }
    );

    if (confirmed) {
      try {
        await peopleAPI.delete(peopleNo);
        await loadPeople();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete person');
      }
    }
  };

  const handleToggleArchive = async (peopleNo: number) => {
    try {
      const person = people.find(p => p.people_no === peopleNo);
      if (person) {
        const action = person.archived ? 'unarchive' : 'archive';
        const confirmed = await confirm(
          `Are you sure you want to ${action} this person?`,
          {
            title: `${action.charAt(0).toUpperCase() + action.slice(1)} Person`,
            confirmText: action.charAt(0).toUpperCase() + action.slice(1),
            cancelText: 'Cancel',
          }
        );

        if (confirmed) {
          await peopleAPI.update(peopleNo, {
            ...person,
            archived: !person.archived
          });
          await loadPeople();
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update person');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPerson(undefined);
  };

  const handleComments = (person: Person) => {
    setCommentsPerson(person);
    setShowComments(true);
  };

  const handleView = (person: Person) => {
    setViewPerson(person);
    setShowViewModal(true);
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

  return (
    <>
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            People Management
          </h4>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search people..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary sm:w-80"
            />
            <button
              onClick={handleCreate}
              className="flex items-center justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
            >
              Add Person
            </button>
          </div>
        </div>

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

        <PersonList
          people={filteredPeople}
          onDelete={handleDelete}
          onToggleArchive={handleToggleArchive}
          onComments={handleComments}
          onView={handleView}
        />
      </div>

      {showForm && (
        <PersonForm
          person={editingPerson}
          onSave={handleSave}
          onCancel={handleCancel}
          saving={saving}
        />
      )}

      {showComments && commentsPerson && (
        <CommentsModal
          isOpen={showComments}
          entityType="People"
          entityNo={commentsPerson.people_no}
          entityName={`${commentsPerson.first_name} ${commentsPerson.last_name}`}
          onClose={() => {
            setShowComments(false);
            setCommentsPerson(null);
          }}
        />
      )}

      {showViewModal && viewPerson && (
        <PersonViewModal
          isOpen={showViewModal}
          person={viewPerson}
          onClose={() => {
            setShowViewModal(false);
            setViewPerson(null);
          }}
        />
      )}

      <ConfirmationDialog {...confirmationProps} />
    </>
  );
}
