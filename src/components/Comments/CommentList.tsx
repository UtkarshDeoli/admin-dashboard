"use client";

import React, { useState } from 'react';
import { Comment } from '@/types/company';

interface CommentListProps {
  comments: Comment[];
  onEdit: (comment: Comment) => void;
  onDelete: (commentNo: number) => void;
}

const CommentList: React.FC<CommentListProps> = ({ comments, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEntityType, setFilterEntityType] = useState('');

  const filteredComments = comments.filter(comment => {
    const matchesSearch = 
      comment.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.entity_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.entity_no.toString().includes(searchTerm);
    
    const matchesEntityType = !filterEntityType || comment.entity_type === filterEntityType;
    
    return matchesSearch && matchesEntityType;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const entityTypes = Array.from(new Set(comments.map(c => c.entity_type)));

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search comments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-strokedark dark:bg-meta-4 dark:text-white"
          />
        </div>
        <div>
          <select
            value={filterEntityType}
            onChange={(e) => setFilterEntityType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-strokedark dark:bg-meta-4 dark:text-white"
          >
            <option value="">All Entity Types</option>
            {entityTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="px-4 py-4 font-medium text-black dark:text-white">Entity</th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">Comment</th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">Admin</th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">Date</th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredComments.map((comment) => (
              <tr key={comment.comment_no} className="border-b border-stroke dark:border-strokedark">
                <td className="px-4 py-4">
                  <div>
                    <div className="font-medium text-black dark:text-white">
                      {comment.entity_type.charAt(0).toUpperCase() + comment.entity_type.slice(1)}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: {comment.entity_no}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-black dark:text-white max-w-md">
                    {comment.comment.length > 100 
                      ? `${comment.comment.substring(0, 100)}...` 
                      : comment.comment}
                  </div>
                </td>
                <td className="px-4 py-4 text-black dark:text-white">
                  Admin {comment.admin_no}
                </td>
                <td className="px-4 py-4 text-black dark:text-white">
                  {formatDate(comment.date)}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEdit(comment)}
                      className="inline-flex items-center justify-center rounded bg-primary py-1 px-2 text-center font-medium text-white hover:bg-opacity-90 text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(comment.comment_no)}
                      className="inline-flex items-center justify-center rounded bg-red-600 py-1 px-2 text-center font-medium text-white hover:bg-red-700 text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredComments.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No comments found.
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentList;
