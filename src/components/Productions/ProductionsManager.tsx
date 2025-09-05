"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/common/Modal";
import ProductionForm from "./ProductionForm";
import ProductionList from "./ProductionList";
import { playProductionsAPI } from "@/lib/api";
import { PlayProduction } from "@/types/play";
import { useConfirmation } from "@/hooks/useConfirmation";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";

export default function ProductionsManager() {
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [deleting, setDeleting] = useState<number[]>([]);
  const [selectedProduction, setSelectedProduction] = useState<PlayProduction | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [productions, setProductions] = useState<PlayProduction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { confirm, confirmationProps } = useConfirmation();

  const loadProductions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await playProductionsAPI.getAll();
      setProductions(data);
    } catch (e: any) {
      console.error("Failed to load productions", e);
      setError(e?.message || 'Failed to load productions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProductions();
  }, []);

  const handleView = (production: PlayProduction) => {
    setSelectedProduction(production);
    setIsViewOpen(true);
  };

  const handleEdit = (production: PlayProduction) => {
    setSelectedProduction(production);
    setIsEditOpen(true);
  };

  const handleDelete = async (productionNo: number) => {
    const ok = await confirm('Are you sure you want to delete this production? This action cannot be undone.', {
      title: 'Delete Production',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger'
    });
    if (!ok) return;
    setDeleting(prev => [...prev, productionNo]);
    try {
      await playProductionsAPI.delete(productionNo);
      await loadProductions();
    } catch (error) {
      console.error("Error deleting production:", error);
    } finally {
      setDeleting(prev => prev.filter(id => id !== productionNo));
    }
  };

  const handleToggleArchive = async (productionNo: number) => {
    try {
      const production = productions.find(p => p.production_no === productionNo);
      if (production) {
        const action = production.archived ? 'unarchive' : 'archive';
        const confirmed = await confirm(
          `Are you sure you want to ${action} this production?`,
          {
            title: `${action.charAt(0).toUpperCase() + action.slice(1)} Production`,
            confirmText: action.charAt(0).toUpperCase() + action.slice(1),
            cancelText: 'Cancel',
          }
        );

        if (confirmed) {
          await playProductionsAPI.update(productionNo, {
            ...production,
            archived: !production.archived
          });
          await loadProductions();
        }
      }
    } catch (err) {
      console.error('Failed to update production', err);
      setError('Failed to update production');
    }
  };

  const handleFormSubmit = async (form: Omit<PlayProduction, 'production_no'>) => {
    try {
      if (selectedProduction) {
        await playProductionsAPI.update(selectedProduction.production_no, form);
      } else {
        await playProductionsAPI.create(form);
      }
      await loadProductions();
      setIsAddOpen(false);
      setIsEditOpen(false);
      setSelectedProduction(null);
    } catch (e) {
      console.error('Failed to save production', e);
      setError('Failed to save production');
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
      <ProductionList
        productions={productions}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleArchive={handleToggleArchive}
        onAdd={() => setIsAddOpen(true)}
        deleting={deleting}
        showSearchForm={showSearchForm}
        onToggleSearch={() => setShowSearchForm(!showSearchForm)}
      />

      <Modal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} title="Production Details" size="lg">
        <div className="p-6.5 space-y-4">
          {selectedProduction ? (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-2 block text-sm font-medium text-black dark:text-white">Production No</p>
                  <p className="text-black dark:text-white font-medium">{selectedProduction.production_no}</p>
                </div>
                <div>
                  <p className="mb-2 block text-sm font-medium text-black dark:text-white">Play No</p>
                  <p className="text-black dark:text-white font-medium">{selectedProduction.play_no ?? '-'}</p>
                </div>
                <div>
                  <p className="mb-2 block text-sm font-medium text-black dark:text-white">Company</p>
                  <p className="text-black dark:text-white font-medium">{(selectedProduction as any).company_name || selectedProduction.company_no || '-'}</p>
                </div>
                <div>
                  <p className="mb-2 block text-sm font-medium text-black dark:text-white">Start</p>
                  <p className="text-black dark:text-white font-medium">{selectedProduction.start_date ?? '-'}</p>
                </div>
                <div>
                  <p className="mb-2 block text-sm font-medium text-black dark:text-white">End</p>
                  <p className="text-black dark:text-white font-medium">{selectedProduction.end_date ?? '-'}</p>
                </div>
                <div>
                  <p className="mb-2 block text-sm font-medium text-black dark:text-white">Season</p>
                  <p className="text-black dark:text-white font-medium">{selectedProduction.season ?? '-'}</p>
                </div>
                <div>
                  <p className="mb-2 block text-sm font-medium text-black dark:text-white">Festival</p>
                  <p className="text-black dark:text-white font-medium">{selectedProduction.festival ?? '-'}</p>
                </div>
                <div>
                  <p className="mb-2 block text-sm font-medium text-black dark:text-white">Canceled</p>
                  <p className="text-black dark:text-white font-medium">{selectedProduction.canceled ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="mb-2 block text-sm font-medium text-black dark:text-white">Archived</p>
                  <p className="text-black dark:text-white font-medium">{selectedProduction.archived ? 'Yes' : 'No'}</p>
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <button
                  type="button"
                  className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-white hover:bg-opacity-90"
                  onClick={() => { setIsViewOpen(false); setIsEditOpen(true); }}
                >
                  Edit Production
                </button>
                <button
                  type="button"
                  className="flex justify-center rounded bg-danger px-6 py-2 font-medium text-white hover:bg-opacity-90"
                  onClick={async () => { if (selectedProduction) { setIsViewOpen(false); await handleDelete(selectedProduction.production_no); } }}
                >
                  Delete Production
                </button>
                <button
                  type="button"
                  className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                  onClick={() => setIsViewOpen(false)}
                >
                  Close
                </button>
              </div>
            </>
          ) : null}
        </div>
      </Modal>

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Production" size="lg">
        <div className="p-6.5">
          <ProductionForm onSubmit={handleFormSubmit} onCancel={() => setIsAddOpen(false)} />
        </div>
      </Modal>

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Production" size="lg">
        <div className="p-6.5">
          <ProductionForm onSubmit={handleFormSubmit} onCancel={() => setIsEditOpen(false)} initialData={selectedProduction ?? undefined} />
        </div>
      </Modal>

      <ConfirmationDialog {...confirmationProps} />
    </div>
  );
}


