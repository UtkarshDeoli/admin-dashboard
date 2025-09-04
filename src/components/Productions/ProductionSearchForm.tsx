"use client";

import React, { useEffect, useState } from "react";

interface ProductionSearchFilters {
  playNo: string;
  companyNo: string;
  season: string;
  festival: string;
  canceled: string; 
}

interface ProductionSearchFormProps {
  onSearch: (filters: ProductionSearchFilters) => void;
  defaultFilters: ProductionSearchFilters;
  searching?: boolean;
}

export default function ProductionSearchForm({ onSearch, defaultFilters, searching = false }: ProductionSearchFormProps) {
  const [filters, setFilters] = useState<ProductionSearchFilters>(defaultFilters);

  useEffect(() => {
    setFilters(defaultFilters);
  }, [defaultFilters]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    const resetFilters: ProductionSearchFilters = { playNo: "", companyNo: "", season: "", festival: "", canceled: "all" };
    setFilters(resetFilters);
    onSearch(resetFilters);
  };

  const handleChange = (name: keyof ProductionSearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <h5 className="mb-4 text-lg font-semibold text-black dark:text-white">Search Productions</h5>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">Play No</label>
            <input value={filters.playNo} onChange={(e)=>handleChange('playNo', e.target.value)} className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" placeholder="Search by play No" />
          </div>
          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">Company No</label>
            <input value={filters.companyNo} onChange={(e)=>handleChange('companyNo', e.target.value)} className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" placeholder="Search by company No" />
          </div>
          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">Season</label>
            <input value={filters.season} onChange={(e)=>handleChange('season', e.target.value)} className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" placeholder="Search by season" />
          </div>
          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">Festival</label>
            <input value={filters.festival} onChange={(e)=>handleChange('festival', e.target.value)} className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" placeholder="Search by festival" />
          </div>
          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">Canceled</label>
            <select value={filters.canceled} onChange={(e)=>handleChange('canceled', e.target.value)} className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button type="submit" disabled={searching} className="flex items-center justify-center rounded bg-primary px-6 py-3 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
            {searching ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Searching...
              </>
            ) : (
              'Search'
            )}
          </button>
          <button type="button" onClick={handleReset} disabled={searching} className="flex items-center justify-center rounded border border-stroke px-6 py-3 font-medium text-black hover:border-black dark:border-strokedark dark:text-white dark:hover:border-white disabled:opacity-50 disabled:cursor-not-allowed">
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}


