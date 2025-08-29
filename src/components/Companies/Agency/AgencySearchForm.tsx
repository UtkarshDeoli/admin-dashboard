"use client";

import React, { useState, useEffect } from "react";

interface AgencySearchFormProps {
  onSearch: (filters: { companyName: string; market: string; unions: string }) => void;
  defaultFilters: { companyName: string; market: string; unions: string };
  searching: boolean;
}

export default function AgencySearchForm({ 
  onSearch, 
  defaultFilters, 
  searching 
}: AgencySearchFormProps) {
  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    setFilters(defaultFilters);
  }, [defaultFilters]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    const resetFilters = { companyName: '', market: '', unions: '' };
    setFilters(resetFilters);
    onSearch(resetFilters);
  };

  const handleChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <h5 className="mb-4 text-lg font-medium text-black dark:text-white">
        Search Agencies
      </h5>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-black dark:text-white">
            Company Name
          </label>
          <input
            type="text"
            value={filters.companyName}
            onChange={(e) => handleChange('companyName', e.target.value)}
            placeholder="Search by company name..."
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-black dark:text-white">
            Market
          </label>
          <input
            type="text"
            value={filters.market}
            onChange={(e) => handleChange('market', e.target.value)}
            placeholder="Search by market..."
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-black dark:text-white">
            Unions
          </label>
          <input
            type="text"
            value={filters.unions}
            onChange={(e) => handleChange('unions', e.target.value)}
            placeholder="Search by unions..."
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>

        <div className="md:col-span-3 flex gap-3 pt-4">
          <button
            type="submit"
            disabled={searching}
            className="flex items-center justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50"
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
            className="flex items-center justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:bg-gray-1 dark:border-strokedark dark:text-white dark:hover:bg-meta-4"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
