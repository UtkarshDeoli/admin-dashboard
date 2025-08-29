"use client";

import React, { useState, useEffect, useCallback } from "react";
import { School } from "@/types/company";

interface SchoolFormProps {
  companyId: number;
  onSave: () => void;
}

export default function SchoolForm({ companyId, onSave }: SchoolFormProps) {
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNewSchool, setIsNewSchool] = useState(false);

  const [formData, setFormData] = useState({
    policy: '',
    technique: '',
    audit: false,
    coaching: false,
    showcase: false,
    bi_coastal: false,
    online: false,
    in_person: false,
    class_size_min: 0,
    class_size_max: 0,
    age_min: 0,
    age_max: 0,
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to load existing school data
      try {
        const response = await fetch(`/api/companies/${companyId}/school`);
        if (response.ok) {
          const schoolData = await response.json();
          console.log('School data loaded:', schoolData);
          if (schoolData) {
            setSchool(schoolData);
            setFormData({
              policy: schoolData.policy || '',
              technique: schoolData.technique || '',
              audit: schoolData.audit || false,
              coaching: schoolData.coaching || false,
              showcase: schoolData.showcase || false,
              bi_coastal: schoolData.bi_coastal || false,
              online: schoolData.online || false,
              in_person: schoolData.in_person || false,
              class_size_min: schoolData.class_size_min || 0,
              class_size_max: schoolData.class_size_max || 0,
              age_min: schoolData.age_min || 0,
              age_max: schoolData.age_max || 0,
            });
            setIsNewSchool(false);
          } else {
            setIsNewSchool(true);
          }
        } else {
          setIsNewSchool(true);
        }
      } catch (err) {
        setIsNewSchool(true);
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
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
               type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      
      const schoolData = {
        company_no: companyId,
        ...formData,
        archived: false
      };
      
      let response;
      if (isNewSchool) {
        response = await fetch('/api/schools', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(schoolData),
        });
      } else if (school) {
        response = await fetch(`/api/schools/${school.school_no}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(schoolData),
        });
      }
      
      if (!response?.ok) {
        throw new Error('Failed to save school data');
      }
      
      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save school data');
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
        School Information
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
              School Policy
            </label>
            <textarea
              name="policy"
              value={formData.policy}
              onChange={handleInputChange}
              rows={4}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              placeholder="Enter school policy details..."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              Teaching Technique
            </label>
            <textarea
              name="technique"
              value={formData.technique}
              onChange={handleInputChange}
              rows={4}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              placeholder="Enter teaching techniques and methods..."
            />
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-md font-medium text-black dark:text-white">Class Size</h4>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Minimum Class Size
              </label>
              <input
                type="number"
                name="class_size_min"
                value={formData.class_size_min}
                onChange={handleInputChange}
                min="0"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Maximum Class Size
              </label>
              <input
                type="number"
                name="class_size_max"
                value={formData.class_size_max}
                onChange={handleInputChange}
                min="0"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-md font-medium text-black dark:text-white">Age Range</h4>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Minimum Age
              </label>
              <input
                type="number"
                name="age_min"
                value={formData.age_min}
                onChange={handleInputChange}
                min="0"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Maximum Age
              </label>
              <input
                type="number"
                name="age_max"
                value={formData.age_max}
                onChange={handleInputChange}
                min="0"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-md font-medium text-black dark:text-white">School Features</h4>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {[
              { name: 'audit', label: 'Audit Classes' },
              { name: 'coaching', label: 'Coaching Available' },
              { name: 'showcase', label: 'Student Showcases' },
              { name: 'bi_coastal', label: 'Bi-Coastal Locations' },
              { name: 'online', label: 'Online Classes' },
              { name: 'in_person', label: 'In-Person Classes' },
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
            {saving ? 'Saving...' : (isNewSchool ? 'Create School' : 'Update School')}
          </button>
        </div>
      </form>
    </div>
  );
}
