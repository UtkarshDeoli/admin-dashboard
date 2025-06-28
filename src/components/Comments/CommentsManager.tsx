"use client";

import React, { useState } from 'react';
import { Comment } from '@/types/company';
import CommentList from './CommentList';
import CommentForm from './CommentForm';

const CommentsManager: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([
    {
      comment_no: 1,
      entity_type: "company",
      entity_no: 1,
      admin_no: 1,
      date: "2024-01-15",
      comment: "This company has excellent reputation in the industry. Very professional and timely."
    },
    {
      comment_no: 2,
      entity_type: "person",
      entity_no: 1,
      admin_no: 2,
      date: "2024-01-20",
      comment: "Great performer, very reliable. Has worked on multiple successful projects."
    },
    {
      comment_no: 3,
      entity_type: "project",
      entity_no: 1,
      admin_no: 1,
      date: "2024-02-01",
      comment: "Project went over budget but delivered exceptional results. Consider for future collaborations."
    },
    {
      comment_no: 4,
      entity_type: "address",
      entity_no: 1,
      admin_no: 3,
      date: "2024-02-10",
      comment: "Address verified and confirmed as accurate. Good location for shoots."
    },
    {
      comment_no: 5,
      entity_type: "company",
      entity_no: 2,
      admin_no: 2,
      date: "2024-02-15",
      comment: "Had some payment delays but resolved quickly. Overall positive experience."
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingComment, setEditingComment] = useState<Comment | undefined>();

  const handleAdd = () => {
    setEditingComment(undefined);
    setShowForm(true);
  };

  const handleEdit = (comment: Comment) => {
    setEditingComment(comment);
    setShowForm(true);
  };

  const handleDelete = (commentNo: number) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      setComments(comments.filter(c => c.comment_no !== commentNo));
    }
  };

  const handleSave = (commentData: Omit<Comment, 'comment_no'> | Comment) => {
    if ('comment_no' in commentData) {
      // Editing existing comment
      setComments(comments.map(c => 
        c.comment_no === commentData.comment_no ? commentData : c
      ));
    } else {
      // Adding new comment
      const newComment: Comment = {
        ...commentData,
        comment_no: Math.max(...comments.map(c => c.comment_no), 0) + 1
      };
      setComments([...comments, newComment]);
    }
    setShowForm(false);
    setEditingComment(undefined);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingComment(undefined);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-black dark:text-white">
            Comments Management
          </h3>
          <button
            onClick={handleAdd}
            className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-4 text-center font-medium text-white hover:bg-opacity-90"
          >
            Add Comment
          </button>
        </div>
      </div>

      <div className="p-6.5">
        <CommentList
          comments={comments}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {showForm && (
        <CommentForm
          comment={editingComment}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default CommentsManager;
