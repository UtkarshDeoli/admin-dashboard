"use client";

import React, { useState, useEffect } from "react";
import { Project } from "@/types/company";
import { projectsAPI } from "@/lib/api";
import ProjectList from "./ProjectList";
import ProjectForm from "./ProjectForm";

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectsAPI.getAll();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  // Filter projects based on search term and archive status
  const filteredProjects = projects.filter(
    (project) => {
      const matchesSearch = 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.aka?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.genre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.casting_status?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesArchiveFilter = showArchived || !project.archived;
      
      return matchesSearch && matchesArchiveFilter;
    }
  );

  const handleAdd = () => {
    setEditingProject(null);
    setShowForm(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDelete = async (projectNo: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await projectsAPI.delete(projectNo);
        await loadProjects();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete project');
      }
    }
  };

  const handleSave = async (projectData: Omit<Project, "project_no">) => {
    try {
      if (editingProject) {
        await projectsAPI.update(editingProject.project_no, projectData);
      } else {
        await projectsAPI.create(projectData);
      }
      setShowForm(false);
      setEditingProject(null);
      await loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save project');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  const handleArchive = async (projectNo: number) => {
    try {
      const project = projects.find(p => p.project_no === projectNo);
      if (project) {
        await projectsAPI.update(projectNo, { ...project, archived: !project.archived });
        await loadProjects();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to archive project');
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
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Projects Management
          </h4>
          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showArchived}
                onChange={(e) => setShowArchived(e.target.checked)}
                className="mr-2 h-5 w-5 rounded-sm border-stroke bg-transparent text-primary checked:bg-primary dark:border-strokedark"
              />
              <span className="text-sm text-black dark:text-white">Show Archived</span>
            </label>
          </div>
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary sm:w-80"
          />
          <button
            onClick={handleAdd}
            className="flex items-center justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
          >
            Add Project
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

      <ProjectList
        projects={filteredProjects}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onArchive={handleArchive}
        showArchived={showArchived}
      />

      {showForm && (
        <div className="fixed inset-0 z-999">
          <ProjectForm
            project={editingProject || undefined}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      )}
    </div>
  );
}
