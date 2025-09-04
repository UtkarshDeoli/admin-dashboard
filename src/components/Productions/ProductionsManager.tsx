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
    const ok = await confirm('Archive this production?\nYou can restore it later.', {
      title: 'Archive Production',
      confirmText: 'Archive',
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
        onAdd={() => setIsAddOpen(true)}
        deleting={deleting}
        showSearchForm={showSearchForm}
        onToggleSearch={() => setShowSearchForm(!showSearchForm)}
      />

      <Modal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} title="View Production" size="lg">
        <div className="p-6.5 space-y-4">
          {selectedProduction ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs text-gray-500">Play No</p>
                <p className="font-medium">{selectedProduction.play_no ?? '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Company No</p>
                <p className="font-medium">{selectedProduction.company_no ?? '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Start</p>
                <p className="font-medium">{selectedProduction.start_date ?? '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">End</p>
                <p className="font-medium">{selectedProduction.end_date ?? '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Season</p>
                <p className="font-medium">{selectedProduction.season ?? '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Festival</p>
                <p className="font-medium">{selectedProduction.festival ?? '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Canceled</p>
                <p className="font-medium">{selectedProduction.canceled ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Archived</p>
                <p className="font-medium">{selectedProduction.archived ? 'Yes' : 'No'}</p>
              </div>
            </div>
          ) : null}
        </div>
      </Modal>

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Production" size="lg">
        <div className="p-6.5">
          <ProductionForm onSubmit={handleFormSubmit} />
        </div>
      </Modal>

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Production" size="lg">
        <div className="p-6.5">
          <ProductionForm onSubmit={handleFormSubmit} initialData={selectedProduction ?? undefined} />
        </div>
      </Modal>

      <ConfirmationDialog {...confirmationProps} />
    </div>
  );
}


