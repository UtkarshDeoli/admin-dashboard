"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Comment } from "@/types/company";
import { commentsAPI } from "@/lib/api";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import { useConfirmation } from "@/hooks/useConfirmation";

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: string;
  entityNo: number;
  entityName: string; // For display purposes
}

export default function CommentsModal({
  isOpen,
  onClose,
  entityType,
  entityNo,
  entityName
}: CommentsModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { confirm, confirmationProps } = useConfirmation();

  const loadComments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await commentsAPI.getByEntity(entityType, entityNo);
      setComments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  }, [entityType, entityNo]);

  useEffect(() => {
    if (isOpen) {
      loadComments();
    }
  }, [isOpen, loadComments]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSaving(true);
      setError(null);
      // For now, using admin_no = 1. In a real app, this would come from the logged-in user
      const comment = await commentsAPI.create(entityType, entityNo, 1, newComment.trim());
      setComments([comment, ...comments]);
      setNewComment("");
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add comment');
    } finally {
      setSaving(false);
    }
  };

  const handleEditComment = (comment: Comment) => {
    setEditingComment(comment);
    setEditText(comment.comment);
  };

  const handleSaveEdit = async () => {
    if (!editingComment || !editText.trim()) return;

    try {
      setSaving(true);
      setError(null);
      const updatedComment = await commentsAPI.update(editingComment.id, editText.trim());
      setComments(comments.map(c => c.id === updatedComment.id ? updatedComment : c));
      setEditingComment(null);
      setEditText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update comment');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditText("");
  };

  const handleDeleteComment = async (commentId: number) => {
    const confirmed = await confirm(
      'Are you sure you want to delete this comment?\nThis action cannot be undone.',
      {
        title: 'Delete Comment',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        variant: 'danger'
      }
    );

    if (confirmed) {
      try {
        setDeleting(commentId);
        await commentsAPI.delete(commentId);
        setComments(comments.filter(c => c.id !== commentId));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete comment');
      } finally {
        setDeleting(null);
      }
    }
  };

  const handleClose = () => {
    setEditingComment(null);
    setEditText("");
    setNewComment("");
    setError(null);
    onClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-99999 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-black bg-opacity-50 p-4">
      <div className="relative w-full max-w-4xl mx-auto my-6">
        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none dark:bg-boxdark max-h-[90vh]">
          {/* Header */}
          <div className="flex items-start justify-between p-4 sm:p-5 border-b border-solid rounded-t border-stroke dark:border-strokedark">
            <h3 className="text-lg sm:text-xl font-semibold text-black dark:text-white">
              Comments for {entityName}
            </h3>
            <button
              className="float-right p-1 ml-auto text-2xl sm:text-3xl font-semibold leading-none text-black bg-transparent border-0 outline-none focus:outline-none dark:text-white hover:opacity-75"
              onClick={handleClose}
            >
              ×
            </button>
          </div>
          
          {/* Body */}
          <div className="relative flex-auto p-4 sm:p-6 max-h-[60vh] sm:max-h-96 overflow-y-auto">
            {/* Add Comment Form */}
            <div className="mb-6">
              <form onSubmit={handleAddComment} className="space-y-4">
                <div>
                  <label className="mb-2.5 block text-black dark:text-white font-medium">
                    Add New Comment
                  </label>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Enter your comment..."
                    rows={3}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-3 sm:px-5 py-2 sm:py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary text-sm sm:text-base"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!newComment.trim() || saving}
                  className="inline-flex items-center justify-center rounded bg-primary px-4 sm:px-6 py-2 font-medium text-white hover:bg-opacity-90 disabled:opacity-50 text-sm sm:text-base"
                >
                  {saving ? 'Adding...' : 'Add Comment'}
                </button>
              </form>
            </div>

            {/* Error Display */}
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

            {/* Loading */}
            {loading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}

            {/* Comments List */}
            {!loading && (
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No comments yet. Add the first comment above.
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="border border-stroke rounded-lg p-3 sm:p-4 dark:border-strokedark"
                    >
                      {editingComment && editingComment.id === comment.id ? (
                        // Edit Mode
                        <div className="space-y-3">
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            rows={3}
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-3 py-2 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary text-sm sm:text-base"
                          />
                          <div className="flex flex-col sm:flex-row gap-2">
                            <button
                              onClick={handleSaveEdit}
                              disabled={!editText.trim() || saving}
                              className="inline-flex items-center justify-center rounded bg-primary px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
                            >
                              {saving ? 'Saving...' : 'Save'}
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="inline-flex items-center justify-center rounded border border-stroke px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium text-black hover:bg-gray-50 dark:border-strokedark dark:text-white dark:hover:bg-gray-800"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        // View Mode
                        <>
                          <div className="flex justify-between items-start mb-2 flex-col sm:flex-row gap-2 sm:gap-0">
                            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                              Admin #{comment.admin_no} • {formatDate(comment.date)}
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2">
                              <button
                                onClick={() => handleEditComment(comment)}
                                className="inline-flex items-center justify-center rounded bg-primary px-2 sm:px-3 py-1 text-xs font-medium text-white hover:bg-opacity-90"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                disabled={deleting === comment.id}
                                className="inline-flex items-center justify-center rounded bg-danger px-2 sm:px-3 py-1 text-xs font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
                              >
                                {deleting === comment.id ? 'Deleting...' : 'Delete'}
                              </button>
                            </div>
                          </div>
                          <p className="text-black dark:text-white whitespace-pre-wrap text-sm sm:text-base">
                            {comment.comment}
                          </p>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end p-4 sm:p-6 border-t border-solid rounded-b border-stroke dark:border-strokedark">
            <button
              className="px-4 sm:px-6 py-2 mb-1 mr-1 text-xs sm:text-sm font-bold text-gray-500 uppercase transition-all duration-150 ease-linear outline-none background-transparent focus:outline-none"
              type="button"
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog {...confirmationProps} />
    </div>
  );
}
