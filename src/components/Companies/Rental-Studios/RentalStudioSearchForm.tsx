"use client";

import React, { useState, useEffect } from "react";

interface RentalStudioSearchFormProps {
  onSearch: (filters: { companyName: string; name: string; rateFrequency: string }) => void;
  defaultFilters: { companyName: string; name: string; rateFrequency: string };
  searching: boolean;
}

export default function RentalStudioSearchForm({ 
  onSearch, 
  defaultFilters, 
  searching 
}: RentalStudioSearchFormProps) {
  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    setFilters(defaultFilters);
  }, [defaultFilters]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleClear = () => {
    const emptyFilters = { companyName: '', name: '', rateFrequency: '' };
    setFilters(emptyFilters);
    onSearch(emptyFilters);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <h4 className="mb-4 text-lg font-semibold text-black dark:text-white">
        Search Rental Studios
      </h4>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              Company Name
            </label>
            <input
              type="text"
              name="companyName"
              value={filters.companyName}
              onChange={handleInputChange}
              placeholder="Search by company name..."
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              Studio Name
            </label>
            <input
              type="text"
              name="name"
              value={filters.name}
              onChange={handleInputChange}
              placeholder="Search by studio name..."
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              Rate Frequency
            </label>
            <input
              type="text"
              name="rateFrequency"
              value={filters.rateFrequency}
              onChange={handleInputChange}
              placeholder="Search by rate frequency..."
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={searching}
            className="flex items-center justify-center rounded bg-primary px-6 py-3 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50"
          >
            {searching ? (
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
            ) : null}
            {searching ? 'Searching...' : 'Search'}
          </button>
          
          <button
            type="button"
            onClick={handleClear}
            disabled={searching}
            className="flex items-center justify-center rounded border border-stroke px-6 py-3 font-medium text-black hover:border-black dark:border-strokedark dark:text-white dark:hover:border-white disabled:opacity-50"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}
