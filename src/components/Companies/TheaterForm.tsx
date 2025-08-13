"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Theater } from "@/types/company";
import { theatersAPI } from "@/lib/api";

interface TheaterFormProps {
  companyId: number;
  onSave: () => void;
}

export default function TheaterForm({ companyId, onSave }: TheaterFormProps) {
  const [theater, setTheater] = useState<Theater | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNewTheater, setIsNewTheater] = useState(false);

  const [formData, setFormData] = useState({
    submission_preference: '',
    literary_submission_preference: '',
    contract: '',
    production_compnay: false,
    summer: false,
    musical: false,
    community: false,
    outdoor: false,
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to load existing theater data
      try {
        const theaterData = await theatersAPI.getByCompany(companyId);
        if (theaterData) {
          setTheater(theaterData);
          setFormData({
            submission_preference: theaterData.submission_preference,
            literary_submission_preference: theaterData.literary_submission_preference,
            contract: theaterData.contract,
            production_compnay: theaterData.production_compnay,
            summer: theaterData.summer,
            musical: theaterData.musical,
            community: theaterData.community,
            outdoor: theaterData.outdoor,
          });
          setIsNewTheater(false);
        } else {
          setIsNewTheater(true);
        }
      } catch (err) {
        setIsNewTheater(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      
      const theaterData = {
        company_no: companyId,
        ...formData,
        archived: false
      };
      
      if (isNewTheater) {
        await theatersAPI.create(theaterData);
      } else if (theater) {
        await theatersAPI.update(theater.theater_no, theaterData);
      }
      
      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save theater data');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6.5">
      <h3 className="mb-6 text-lg font-semibold text-black dark:text-white">
        Theater Information
      </h3>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              Submission Preference
            </label>
            <input
              type="text"
              name="submission_preference"
              value={formData.submission_preference}
              onChange={handleInputChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              Literary Submission Preference
            </label>
            <input
              type="text"
              name="literary_submission_preference"
              value={formData.literary_submission_preference}
              onChange={handleInputChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-black dark:text-white">
            Contract Details
          </label>
          <textarea
            name="contract"
            value={formData.contract}
            onChange={handleInputChange}
            rows={4}
            placeholder="Describe contract terms, requirements, etc."
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>

        <div>
          <h4 className="mb-4 text-md font-medium text-black dark:text-white">Theater Type & Features</h4>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {[
              { name: 'production_compnay', label: 'Production Company' },
              { name: 'summer', label: 'Summer Theater' },
              { name: 'musical', label: 'Musical Theater' },
              { name: 'community', label: 'Community Theater' },
              { name: 'outdoor', label: 'Outdoor Theater' },
            ].map((field) => (
              <div key={field.name} className="flex items-center">
                <input
                  type="checkbox"
                  id={field.name}
                  name={field.name}
                  checked={formData[field.name as keyof typeof formData] as boolean}
                  onChange={handleInputChange}
                  className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor={field.name} className="text-sm text-black dark:text-white">
                  {field.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center rounded bg-primary px-6 py-3 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50"
          >
            {saving ? (
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
            ) : null}
            {saving ? 'Saving...' : (isNewTheater ? 'Create Theater' : 'Update Theater')}
          </button>
        </div>
      </form>
    </div>
  );
}
