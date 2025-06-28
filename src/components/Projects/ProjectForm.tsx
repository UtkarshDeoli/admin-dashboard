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

  const projectTypes = ['Theater', 'Film', 'TV', 'Commercial', 'Web Series', 'Music Video', 'Other'];
  const castingStatuses = ['Open', 'Closed', 'In Progress', 'On Hold', 'Completed'];
  const unions = ['AEA', 'SAG-AFTRA', 'Non-Union', 'Other'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          {project ? 'Edit Project' : 'Add Project'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Also Known As (AKA)
              </label>
              <input
                type="text"
                name="aka"
                value={formData.aka}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Formerly Known As (FKA)
              </label>
              <input
                type="text"
                name="fka"
                value={formData.fka}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Type</option>
                {projectTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Genre
              </label>
              <input
                type="text"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Casting Status
              </label>
              <select
                name="casting_status"
                value={formData.casting_status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {castingStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Union
              </label>
              <select
                name="union"
                value={formData.union}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Union</option>
                {unions.map(union => (
                  <option key={union} value={union}>{union}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primary Location
              </label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  name="city1"
                  value={formData.city1}
                  onChange={handleChange}
                  placeholder="City"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="state1"
                  value={formData.state1}
                  onChange={handleChange}
                  placeholder="State"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="country1"
                  value={formData.country1}
                  onChange={handleChange}
                  placeholder="Country"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Secondary Location
              </label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  name="city2"
                  value={formData.city2}
                  onChange={handleChange}
                  placeholder="City"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="state2"
                  value={formData.state2}
                  onChange={handleChange}
                  placeholder="State"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="country2"
                  value={formData.country2}
                  onChange={handleChange}
                  placeholder="Country"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Musical</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="publish"
                checked={formData.publish}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Publish</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="archived"
                checked={formData.archived}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Archived</span>
            </label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
