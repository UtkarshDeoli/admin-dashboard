"use client";

import React, { useState } from 'react';
import { Project } from '@/types/company';

interface ProjectListProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (projectNo: number) => void;
  onArchive: (projectNo: number) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, onEdit, onDelete, onArchive }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.aka.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.casting_status.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesArchiveFilter = showArchived || !project.archived;
    
    return matchesSearch && matchesArchiveFilter;
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-strokedark dark:bg-meta-4 dark:text-white"
          />
        </div>
        <div className="flex items-center">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showArchived}
              onChange={(e) => setShowArchived(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Show Archived</span>
          </label>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="px-4 py-4 font-medium text-black dark:text-white">Name</th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">Type</th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">Genre</th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">Status</th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">Dates</th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">Location</th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">Union</th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">Status</th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project) => (
              <tr key={project.project_no} className="border-b border-stroke dark:border-strokedark">
                <td className="px-4 py-4">
                  <div>
                    <div className="font-medium text-black dark:text-white">
                      {project.name}
                    </div>
                    {project.aka && (
                      <div className="text-sm text-gray-500">
                        AKA: {project.aka}
                      </div>
                    )}
                    {project.fka && (
                      <div className="text-sm text-gray-500">
                        FKA: {project.fka}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-black dark:text-white">{project.type}</span>
                    {project.musical && (
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                        Musical
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4 text-black dark:text-white">{project.genre}</td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    project.casting_status === 'Open' ? 'bg-green-100 text-green-800' :
                    project.casting_status === 'Closed' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {project.casting_status}
                  </span>
                </td>
                <td className="px-4 py-4 text-black dark:text-white">
                  <div className="text-sm">
                    <div>Start: {formatDate(project.start_date)}</div>
                    <div>End: {formatDate(project.end_date)}</div>
                  </div>
                </td>
                <td className="px-4 py-4 text-black dark:text-white">
                  <div className="text-sm">
                    {project.city1 && (
                      <div>{project.city1}, {project.state1}</div>
                    )}
                    {project.city2 && (
                      <div>{project.city2}, {project.state2}</div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4 text-black dark:text-white">{project.union}</td>
                <td className="px-4 py-4">
                  <div className="flex flex-col space-y-1">
                    {project.publish && (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                        Published
                      </span>
                    )}
                    {project.archived && (
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                        Archived
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEdit(project)}
                      className="inline-flex items-center justify-center rounded bg-primary py-1 px-2 text-center font-medium text-white hover:bg-opacity-90 text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onArchive(project.project_no)}
                      className={`inline-flex items-center justify-center rounded py-1 px-2 text-center font-medium text-xs ${
                        project.archived 
                          ? 'bg-green-600 text-white hover:bg-green-700' 
                          : 'bg-yellow-600 text-white hover:bg-yellow-700'
                      }`}
                    >
                      {project.archived ? 'Restore' : 'Archive'}
                    </button>
                    <button
                      onClick={() => onDelete(project.project_no)}
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
        
        {filteredProjects.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No projects found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectList;
