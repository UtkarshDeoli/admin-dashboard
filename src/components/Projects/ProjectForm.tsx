"use client";

import React, { useState, useEffect } from 'react';
import { Project } from '@/types/company';

interface ProjectFormProps {
  project?: Project;
  onSave: (project: Omit<Project, 'project_no'> | Project) => void;
  onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    aka: '',
    fka: '',
    type: '',
    genre: '',
    casting_status: 'Open',
    union: '',
    start_date: '',
    end_date: '',
    description: '',
    musical: false,
    publish: false,
    archived: false,
    city1: '',
    state1: '',
    country1: '',
    city2: '',
    state2: '',
    country2: ''
  });

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        aka: project.aka,
        fka: project.fka,
        type: project.type,
        genre: project.genre,
        casting_status: project.casting_status,
        union: project.union,
        start_date: project.start_date,
        end_date: project.end_date,
        description: project.description,
        musical: project.musical,
        publish: project.publish,
        archived: project.archived,
        city1: project.city1,
        state1: project.state1,
        country1: project.country1,
        city2: project.city2,
        state2: project.state2,
        country2: project.country2
      });
    }
  }, [project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (project) {
      onSave({ ...project, ...formData });
    } else {
      onSave(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const projectTypes = ['TV', 'Film', 'Broadway', 'Off-Broadway', 'Development', 'New Media', 'Tour', 'Regional Theatre'];
  const castingStatuses = ['TBA', 'Casting', 'Shooting', 'Wrapped', 'Ongoing', 'Casting & Shooting', 'Development'];
  const genres = ['action', 'adventure', 'animation', 'biography', 'comedy', 'crime', 'documentary', 'drama', 'family', 'fantasy', 'history', 'horror', 'musical', 'mystery', 'romance', 'sci_fi', 'thriller', 'war', 'western', 'reality', 'talk_show', 'game_show', 'film_noir', 'experimental'];


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-boxdark rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 border-b border-stroke pb-5 dark:border-strokedark">
          <h2 className="text-xl font-semibold text-black dark:text-white">
            {project ? 'Edit Project' : 'Add Project'}
          </h2>
          <button 
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Project Name <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter project name"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Also Known As (AKA)
              </label>
              <input
                type="text"
                name="aka"
                value={formData.aka}
                onChange={handleChange}
                placeholder="Enter AKA"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Formerly Known As (FKA)
              </label>
              <input
                type="text"
                name="fka"
                value={formData.fka}
                onChange={handleChange}
                placeholder="Enter FKA"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Type <span className="text-meta-1">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              >
                <option value="">Select Type</option>
                {projectTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Genre
              </label>
              <select
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              >
              <option value="">Select Genre</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
              </select>
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Casting Status
              </label>
              <select
                name="casting_status"
                value={formData.casting_status}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              >
                {castingStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Union
              </label>
                <input
                type="text"
                name="union"
                value={formData.union}
                onChange={handleChange}
                placeholder="Enter Union"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Start Date
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                End Date
              </label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Enter project description"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Primary Location
              </label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  name="city1"
                  value={formData.city1}
                  onChange={handleChange}
                  placeholder="City"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                <input
                  type="text"
                  name="state1"
                  value={formData.state1}
                  onChange={handleChange}
                  placeholder="State"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                <input
                  type="text"
                  name="country1"
                  value={formData.country1}
                  onChange={handleChange}
                  placeholder="Country"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Secondary Location
              </label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  name="city2"
                  value={formData.city2}
                  onChange={handleChange}
                  placeholder="City"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                <input
                  type="text"
                  name="state2"
                  value={formData.state2}
                  onChange={handleChange}
                  placeholder="State"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                <input
                  type="text"
                  name="country2"
                  value={formData.country2}
                  onChange={handleChange}
                  placeholder="Country"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="musical"
                checked={formData.musical}
                onChange={handleChange}
                className="mr-2 h-5 w-5 rounded-sm border-stroke bg-transparent text-primary checked:bg-primary dark:border-strokedark"
              />
              <span className="text-sm text-black dark:text-white">Musical</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="publish"
                checked={formData.publish}
                onChange={handleChange}
                className="mr-2 h-5 w-5 rounded-sm border-stroke bg-transparent text-primary checked:bg-primary dark:border-strokedark"
              />
              <span className="text-sm text-black dark:text-white">Publish</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="archived"
                checked={formData.archived}
                onChange={handleChange}
                className="mr-2 h-5 w-5 rounded-sm border-stroke bg-transparent text-primary checked:bg-primary dark:border-strokedark"
              />
              <span className="text-sm text-black dark:text-white">Archived</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={onCancel}
              className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
            >
              {project ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
