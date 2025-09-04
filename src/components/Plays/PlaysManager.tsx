"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/common/Modal";
import PlayForm from "./PlayForm";
import PlayList from "./PlayList";
import { playsAPI } from "@/lib/api";
import { Play } from "@/types/play";
import { useConfirmation } from "@/hooks/useConfirmation";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";

export default function PlaysManager() {
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [deleting, setDeleting] = useState<number[]>([]);
  const [selectedPlay, setSelectedPlay] = useState<Play | null>(null);
  const { confirm, confirmationProps } = useConfirmation();
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [plays, setPlays] = useState<Play[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  useEffect(() => {
    loadPlays();
  }, []);

  const loadPlays = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await playsAPI.getAll();
      setPlays(data);
    } catch (e: any) {
      setError(e?.message || 'Failed to load plays');
    } finally {
      setLoading(false);
    }
  };
  const handleView = (play: Play) => {
    setSelectedPlay(play);
    setIsViewOpen(true);
  };

  const handleEdit = (play: Play) => {
    setSelectedPlay(play);
    setIsEditOpen(true);
  };

  const handleAdd = () => {
    setSelectedPlay(null);
    setIsAddOpen(true);
  };

  const handleFormSubmit = async (formData: Omit<Play, 'play_no'>) => {
    try {
      if (selectedPlay) {
        await playsAPI.update(selectedPlay.play_no, formData);
      } else {
        await playsAPI.create(formData);
      }
      loadPlays(); 
      setIsAddOpen(false);
      setIsEditOpen(false);
      setSelectedPlay(null);
    } catch (error) {
      console.error('Error saving play:', error);
      setError('Failed to save play');
    }
  };

  const handleDelete = async (playNo: number) => {
    const confirmed = await confirm(
      'Are you sure you want to delete this play?\nThis action cannot be undone.',
      {
        title: 'Delete Play',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        variant: 'danger'
      }
    );

    if (confirmed) {
      setDeleting(prev => [...prev, playNo]);
      try {
        await playsAPI.delete(playNo);
        loadPlays();
      } catch (error) {
        console.error("Error deleting play:", error);
        setError('Failed to delete play');
      } finally {
        setDeleting(prev => prev.filter(id => id !== playNo));
      }
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
      <PlayList
        plays={plays}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
        deleting={deleting}
        showSearchForm={showSearchForm}
        onToggleSearch={() => setShowSearchForm(!showSearchForm)}
      />

      <Modal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} title="View Play" size="lg">
        <div className="p-6.5 space-y-4">
          {selectedPlay ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs text-gray-500">Title</p>
                <p className="font-medium">{selectedPlay.title}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Play Type</p>
                <div className="flex flex-wrap gap-1">
                  {(() => {
                    const types = Array.isArray(selectedPlay.play_type)
                      ? selectedPlay.play_type
                      : String(selectedPlay.play_type || '')
                          .replace(/[{}]/g, '')
                          .split(',')
                          .map(t => t.trim())
                          .filter(Boolean);
                    return types.length ? (
                      types.map((type: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                        >
                          {type}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">N/A</span>
                    );
                  })()}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Play Number</p>
                <p className="font-medium">{selectedPlay.play_no}</p>
              </div>
            </div>
          ) : null}
        </div>
      </Modal>

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add New Play" size="lg">
        <div className="p-6.5">
          <PlayForm onSubmit={handleFormSubmit} />
        </div>
      </Modal>

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Play" size="lg">
        <div className="p-6.5">
          <PlayForm onSubmit={handleFormSubmit} initialData={selectedPlay} />
        </div>
      </Modal>

      <ConfirmationDialog {...confirmationProps} />
    </div>
  );
}