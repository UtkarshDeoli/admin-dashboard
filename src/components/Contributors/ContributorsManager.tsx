"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/common/Modal";
import ContributorList from "./ContributorList";
import ContributorForm from "./ContributorForm";
import { PlayContributor } from "@/types/play";
import { playContributorsAPI } from "@/lib/api";
import { useConfirmation } from "@/hooks/useConfirmation";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";

export default function ContributorsManager() {
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [deleting, setDeleting] = useState<number[]>([]);
  const [selectedContributor, setSelectedContributor] = useState<PlayContributor | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [contributors, setContributors] = useState<PlayContributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { confirm, confirmationProps } = useConfirmation();

  const loadContributors = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await playContributorsAPI.getAll();
      setContributors(data);
    } catch (e: any) {
      setError(e?.message || 'Failed to load contributors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContributors();
  }, []);

  const handleView = (contributor: PlayContributor) => {
    setSelectedContributor(contributor);
    setIsViewOpen(true);
  };

  const handleEdit = (contributor: PlayContributor) => {
    setSelectedContributor(contributor);
    setIsEditOpen(true);
  };

  const handleDelete = async (contributorNo: number) => {
    const ok = await confirm('Delete this contributor?', { title: 'Delete Contributor', confirmText: 'Delete', cancelText: 'Cancel', variant: 'danger' });
    if (!ok) return;
    setDeleting(prev => [...prev, contributorNo]);
    try {
      await playContributorsAPI.delete(contributorNo);
      await loadContributors();
    } catch (e) {
      setError('Failed to delete contributor');
    } finally {
      setDeleting(prev => prev.filter(id => id !== contributorNo));
    }
  };

  const handleFormSubmit = async (form: Omit<PlayContributor, 'pc_no'>) => {
    try {
      if (selectedContributor) {
        await playContributorsAPI.update(selectedContributor.pc_no, form);
      } else {
        await playContributorsAPI.create(form);
      }
      await loadContributors();
      setIsAddOpen(false);
      setIsEditOpen(false);
      setSelectedContributor(null);
    } catch (e) {
      setError('Failed to save contributor');
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

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      {error && (
        <div className="mb-4 rounded-sm border border-danger bg-danger bg-opacity-10 px-4 py-3 text-danger">
          <p>{error}</p>
          <button onClick={() => setError(null)} className="mt-2 text-sm underline hover:no-underline">Dismiss</button>
        </div>
      )}
      <ContributorList
        contributors={contributors}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={() => setIsAddOpen(true)}
        deleting={deleting}
        showSearchForm={showSearchForm}
        onToggleSearch={() => setShowSearchForm(!showSearchForm)}
      />

      <Modal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} title="View Contributor" size="lg">
        <div className="p-6.5 space-y-4">
          {selectedContributor ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs text-gray-500">PC No</p>
                <p className="font-medium">{selectedContributor.pc_no}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">People No</p>
                <p className="font-medium">{selectedContributor.people_no ?? '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Contributor Type</p>
                <p className="font-medium">{selectedContributor.play_contributor_type}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Play No</p>
                <p className="font-medium">{selectedContributor.play_no ?? '-'}</p>
              </div>
            </div>
          ) : null}
        </div>
      </Modal>

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Contributor" size="lg">
        <div className="p-6.5">
          <ContributorForm onSubmit={handleFormSubmit} />
        </div>
      </Modal>

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Contributor" size="lg">
        <div className="p-6.5">
          <ContributorForm onSubmit={handleFormSubmit} initialData={selectedContributor ?? undefined} />
        </div>
      </Modal>

      <ConfirmationDialog {...confirmationProps} />
    </div>
  );
}
