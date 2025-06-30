"use client";

import React, { useState, useEffect } from 'react';
import { Person } from '@/types/company';

interface PersonFormProps {
  person?: Person;
  onSave: (person: Omit<Person, 'people_no'> | Person) => void;
  onCancel: () => void;
}

const PersonForm: React.FC<PersonFormProps> = ({ person, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    address_no: 0,
    no_book: false,
    archived: false,
  });

  useEffect(() => {
    if (person) {
      setFormData({
        first_name: person.first_name,
        middle_name: person.middle_name,
        last_name: person.last_name,
        address_no: person.address_no,
        no_book: person.no_book,
        archived: person.archived,
      });
    }
  }, [person]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (person) {
      onSave({ ...person, ...formData });
    } else {
      onSave(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              name === 'address_no' ? parseInt(value) || 0 : value
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl dark:bg-boxdark">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-black dark:text-white">
            {person ? 'Edit Person' : 'Add New Person'}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
                First Name <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                placeholder="Enter first name"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
                Middle Name
              </label>
              <input
                type="text"
                name="middle_name"
                value={formData.middle_name}
                onChange={handleChange}
                placeholder="Enter middle name"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
                Last Name <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                placeholder="Enter last name"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
                Address Number
              </label>
              <input
                type="number"
                name="address_no"
                value={formData.address_no}
                onChange={handleChange}
                min="0"
                placeholder="Enter address number"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
            <label className="flex cursor-pointer select-none items-center text-sm font-medium text-black dark:text-white">
              <div className="relative">
                <input
                  type="checkbox"
                  name="no_book"
                  checked={formData.no_book}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div
                  className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${
                    formData.no_book
                      ? "border-primary bg-gray dark:bg-transparent"
                      : "border-stroke dark:border-strokedark"
                  }`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-sm ${
                      formData.no_book ? "bg-primary" : ""
                    }`}
                  ></span>
                </div>
              </div>
              No Book
            </label>

            <label className="flex cursor-pointer select-none items-center text-sm font-medium text-black dark:text-white">
              <div className="relative">
                <input
                  type="checkbox"
                  name="archived"
                  checked={formData.archived}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div
                  className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${
                    formData.archived
                      ? "border-primary bg-gray dark:bg-transparent"
                      : "border-stroke dark:border-strokedark"
                  }`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-sm ${
                      formData.archived ? "bg-primary" : ""
                    }`}
                  ></span>
                </div>
              </div>
              Archived
            </label>
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-primary px-4 py-2 text-white hover:bg-opacity-90"
            >
              {person ? 'Update Person' : 'Add Person'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonForm;
