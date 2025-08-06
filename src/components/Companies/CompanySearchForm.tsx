"use client";

import React, { useState, useEffect } from "react";

interface CompanySearchFormProps {
  onSearch: (filters: { name: string; companyType: string }) => void;
  defaultFilters: { name: string; companyType: string };
  companyTypes: string[];
  searching: boolean;
}

export default function CompanySearchForm({
  onSearch,
  defaultFilters,
  companyTypes,
  searching
}: CompanySearchFormProps) {
  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    setFilters(defaultFilters);
  }, [defaultFilters]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    const resetFilters = { name: '', companyType: '' };
    setFilters(resetFilters);
    onSearch(resetFilters);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    
    // Auto-search on input change
    onSearch(newFilters);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <h5 className="mb-4 text-lg font-semibold text-black dark:text-white">
        Search Companies
      </h5>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Company Name Search */}
          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Company Name
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                placeholder="Search by name, description, FKA, or acronym..."
                value={filters.name}
                onChange={handleInputChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {searching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                </div>
              )}
            </div>
          </div>

          {/* Company Type Filter */}
          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Company Type
            </label>
            <select
              name="companyType"
              value={filters.companyType}
              onChange={handleInputChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            >
              {companyTypes.map((type) => (
                <option key={type} value={type === 'All' ? '' : type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-end gap-3">
            <button
              type="submit"
              disabled={searching}
              className="flex items-center justify-center rounded bg-primary px-6 py-3 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {searching ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Searching...
                </>
              ) : (
                'Search'
              )}
            </button>
            
            <button
              type="button"
              onClick={handleReset}
              disabled={searching}
              className="flex items-center justify-center rounded border border-stroke px-6 py-3 font-medium text-black hover:border-black dark:border-strokedark dark:text-white dark:hover:border-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Search Results Info */}
        {(filters.name || filters.companyType) && (
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Active filters: 
            {filters.name && <span className="ml-1 px-2 py-1 bg-primary bg-opacity-10 text-primary rounded">Name: &quot;{filters.name}&quot;</span>}
            {filters.companyType && <span className="ml-1 px-2 py-1 bg-primary bg-opacity-10 text-primary rounded">Type: {filters.companyType}</span>}
          </div>
        )}
      </form>
    </div>
  );
}
