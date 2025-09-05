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
      
      const playsWithContributors = await Promise.all(
        data.map(async (play) => {
          try {
            const playWithContributors = await playsAPI.getById(play.play_no);
            return playWithContributors;
          } catch (error) {
            console.error(`Failed to load contributors for play ${play.play_no}:`, error);
            return play; 
          }
        })
      );
      
      setPlays(playsWithContributors);
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

  const getPlayTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'Play': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Musical': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Opera': return 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200';
      case 'Short': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case '1-Act': return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200';
      case 'Operetta': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      case 'Youth': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
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

      <Modal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} title="Play Details" size="lg">
        <div className="p-6.5 space-y-4">
          {selectedPlay ? (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-2 block text-sm font-medium text-black dark:text-white">Title</p>
                  <p className="text-black dark:text-white font-semibold">{selectedPlay.title}</p>
                </div>
                <div>
                  <p className="mb-2 block text-sm font-medium text-black dark:text-white">Play Type</p>
                  <div className="mt-4 flex flex-wrap gap-1">
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
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPlayTypeBadgeColor(type)}`}
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
                  <p className="mb-2 block text-sm font-medium text-black dark:text-white">Play Number</p>
                  <p className="text-black dark:text-white font-medium">{selectedPlay.play_no}</p>
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <button
                  type="button"
                  className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                  onClick={() => {
                    setIsViewOpen(false);
                    setIsEditOpen(true);
                  }}
                >
                  Edit Play
                </button>
                <button
                  type="button"
                  className="flex justify-center rounded bg-danger px-6 py-2 font-medium text-white hover:bg-opacity-90"
                  onClick={async () => {
                    if (selectedPlay) {
                      setIsViewOpen(false);
                      await handleDelete(selectedPlay.play_no);
                    }
                  }}
                >
                  Delete Play
                </button>
                <button
                  type="button"
                  className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white hover:dark:border-white hover:border-black"
                  onClick={() => setIsViewOpen(false)}
                >
                  Close
                </button>
              </div>
            </>
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
          <PlayForm onSubmit={handleFormSubmit} initialData={selectedPlay} onCancel={() => setIsEditOpen(false)} />
        </div>
      </Modal>

      <ConfirmationDialog {...confirmationProps} />
    </div>
  );
}