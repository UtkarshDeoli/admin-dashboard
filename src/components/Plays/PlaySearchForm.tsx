"use client";

import React, { useEffect, useState } from "react";

interface PlaySearchFilters {
  title: string;
  playType: string;
  playNo: string;
}

interface PlaySearchFormProps {
  onSearch: (filters: PlaySearchFilters) => void;
  defaultFilters: PlaySearchFilters;
  searching?: boolean;
}

export default function PlaySearchForm({ onSearch, defaultFilters, searching = false }: PlaySearchFormProps) {
  const [filters, setFilters] = useState<PlaySearchFilters>(defaultFilters);

  useEffect(() => {
    setFilters(defaultFilters);
  }, [defaultFilters]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    const resetFilters: PlaySearchFilters = { title: '', playType: '', playNo: '' };
    setFilters(resetFilters);
    onSearch(resetFilters);
  };

  const handleChange = (name: keyof PlaySearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <h5 className="mb-4 text-lg font-semibold text-black dark:text-white">Search Plays</h5>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">Play No</label>
            <input value={filters.playNo} onChange={(e)=>handleChange('playNo', e.target.value)} className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" placeholder="Search by play no" />
          </div>
          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">Title</label>
            <input value={filters.title} onChange={(e)=>handleChange('title', e.target.value)} className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" placeholder="Search by play title" />
          </div>
          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">Play Type</label>
            <input value={filters.playType} onChange={(e)=>handleChange('playType', e.target.value)} className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" placeholder="Search by play type" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button type="submit" disabled={searching} className="flex items-center justify-center rounded bg-primary px-6 py-3 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">{searching ? 'Searching...' : 'Search'}</button>
          <button type="button" onClick={handleReset} disabled={searching} className="flex items-center justify-center rounded border border-stroke px-6 py-3 font-medium text-black hover:border-black dark:border-strokedark dark:text-white dark:hover:border-white disabled:opacity-50 disabled:cursor-not-allowed">Reset</button>
        </div>
      </form>
    </div>
  );
}


