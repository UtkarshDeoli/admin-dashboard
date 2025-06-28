"use client";

import React, { useState } from 'react';
import { Project } from '@/types/company';
import ProjectList from './ProjectList';
import ProjectForm from './ProjectForm';

const ProjectsManager: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      project_no: 1,
      name: "Summer Theater Festival",
      aka: "STF 2024",
      fka: "",
      type: "Theater",
      genre: "Musical",
      casting_status: "Open",
      union: "AEA",
      start_date: "2024-06-01",
      end_date: "2024-08-31",
      description: "Annual summer theater festival featuring new musicals",
      musical: true,
      publish: true,
      archived: false,
      city1: "New York",
      state1: "NY",
      country1: "USA",
      city2: "",
      state2: "",
      country2: ""
    },
    {
      project_no: 2,
      name: "Independent Film Project",
      aka: "IFP",
      fka: "Indie Movie 2024",
      type: "Film",
      genre: "Drama",
      casting_status: "Closed",
      union: "SAG-AFTRA",
      start_date: "2024-03-15",
      end_date: "2024-05-30",
      description: "Low budget independent drama film",
      musical: false,
      publish: false,
      archived: false,
      city1: "Los Angeles",
      state1: "CA",
      country1: "USA",
      city2: "San Francisco",
      state2: "CA",
      country2: "USA"
    },
    {
      project_no: 3,
      name: "Commercial Campaign",
      aka: "CC2024",
      fka: "",
      type: "Commercial",
      genre: "Advertisement",
      casting_status: "In Progress",
      union: "SAG-AFTRA",
      start_date: "2024-04-01",
      end_date: "2024-04-15",
      description: "National commercial campaign for tech company",
      musical: false,
      publish: true,
      archived: true,
      city1: "Chicago",
      state1: "IL",
      country1: "USA",
      city2: "",
      state2: "",
      country2: ""
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();

  const handleAdd = () => {
    setEditingProject(undefined);
    setShowForm(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDelete = (projectNo: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter(p => p.project_no !== projectNo));
    }
  };

  const handleArchive = (projectNo: number) => {
    setProjects(projects.map(p => 
      p.project_no === projectNo ? { ...p, archived: !p.archived } : p
    ));
  };

  const handleSave = (projectData: Omit<Project, 'project_no'> | Project) => {
    if ('project_no' in projectData) {
      // Editing existing project
      setProjects(projects.map(p => 
        p.project_no === projectData.project_no ? projectData : p
      ));
    } else {
      // Adding new project
      const newProject: Project = {
        ...projectData,
        project_no: Math.max(...projects.map(p => p.project_no), 0) + 1
      };
      setProjects([...projects, newProject]);
    }
    setShowForm(false);
    setEditingProject(undefined);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProject(undefined);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-black dark:text-white">
            Projects Management
          </h3>
          <button
            onClick={handleAdd}
            className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-4 text-center font-medium text-white hover:bg-opacity-90"
          >
            Add Project
          </button>
        </div>
      </div>

      <div className="p-6.5">
        <ProjectList
          projects={projects}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onArchive={handleArchive}
        />
      </div>

      {showForm && (
        <ProjectForm
          project={editingProject}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default ProjectsManager;
