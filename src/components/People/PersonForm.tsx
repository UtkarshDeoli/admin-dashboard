"use client";

import React, { useState, useEffect } from 'react';
import { Person } from '@/types/company';

interface PersonFormProps {
  person?: Person;
  onSave: (person: Omit<Person, 'people_no'> | Person) => void;
  onCancel: () => void;
  saving?: boolean;
  isInline?: boolean;
}

const PersonForm: React.FC<PersonFormProps> = ({ person, onSave, onCancel, saving = false, isInline = false }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    no_book: false,
  });

  // Initialize form data only once when person changes, not on every render
  useEffect(() => {
    if (person) {
      setFormData({
        first_name: person.first_name || '',
        middle_name: person.middle_name || '',
        last_name: person.last_name || '',
        no_book: person.no_book || false,
      });
    } else {
      // Reset form when no person is provided
      setFormData({
        first_name: '',
        middle_name: '',
        last_name: '',
        no_book: false,
      });
    }
  }, [person?.people_no]); // Only depend on person ID to avoid unnecessary resets

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (person) {
      onSave({ ...person, ...formData });
    } else {
      onSave({ ...formData, archived: false });
    }
  };

  // Use useCallback to prevent unnecessary re-renders
  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  }, []);

  return (
    <>
      {isInline ? (
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 sm:gap-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white sm:mb-2.5">
                First Name <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                placeholder="Enter first name"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-3 py-2 text-sm text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary sm:px-5 sm:py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white sm:mb-2.5">
                Middle Name
              </label>
              <input
                type="text"
                name="middle_name"
                value={formData.middle_name}
                onChange={handleChange}
                placeholder="Enter middle name"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-3 py-2 text-sm text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary sm:px-5 sm:py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white sm:mb-2.5">
                Last Name <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                placeholder="Enter last name"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-3 py-2 text-sm text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary sm:px-5 sm:py-3"
              />
            </div>

            <div className="flex items-center">
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
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end sm:gap-4 sm:pt-6">
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 sm:w-auto disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90 sm:w-auto disabled:opacity-50"
            >
              {saving ? (
                <>
                  <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                person ? 'Update Person' : 'Add Person'
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-4 shadow-xl dark:bg-boxdark sm:p-6">
            <div className="mb-4 flex items-center justify-between sm:mb-6">
              <h3 className="text-lg font-semibold text-black dark:text-white sm:text-xl">
                {person ? 'Edit Person' : 'Add New Person'}
              </h3>
              <button
                onClick={onCancel}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 sm:gap-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-black dark:text-white sm:mb-2.5">
                    First Name <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    placeholder="Enter first name"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-3 py-2 text-sm text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary sm:px-5 sm:py-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-black dark:text-white sm:mb-2.5">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    name="middle_name"
                    value={formData.middle_name}
                    onChange={handleChange}
                    placeholder="Enter middle name"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-3 py-2 text-sm text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary sm:px-5 sm:py-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-black dark:text-white sm:mb-2.5">
                    Last Name <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    placeholder="Enter last name"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-3 py-2 text-sm text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary sm:px-5 sm:py-3"
                  />
                </div>

                <div className="flex items-center">
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
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end sm:gap-4 sm:pt-6">
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={saving}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 sm:w-auto disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90 sm:w-auto disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    person ? 'Update Person' : 'Add Person'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default PersonForm;
