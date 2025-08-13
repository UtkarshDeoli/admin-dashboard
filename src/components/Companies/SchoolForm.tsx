"use client";

import React, { useState, useEffect } from "react";
import { School } from "@/types/company";
import { schoolsAPI } from "@/lib/api";

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

  useEffect(() => {
    loadData();
  }, [companyId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to load existing school data
      try {
        const schoolData = await schoolsAPI.getByCompany(companyId);
        console.log('School data:', schoolData);
        if (schoolData) {
          setSchool(schoolData);
          setFormData({
            policy: schoolData.policy,
            technique: schoolData.technique,
            audit: schoolData.audit,
            coaching: schoolData.coaching,
            showcase: schoolData.showcase,
            bi_coastal: schoolData.bi_coastal,
            online: schoolData.online,
            in_person: schoolData.in_person,
            class_size_min: schoolData.class_size_min,
            class_size_max: schoolData.class_size_max,
            age_min: schoolData.age_min,
            age_max: schoolData.age_max,
          });
          setIsNewSchool(false);
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
  };

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
      
      if (isNewSchool) {
        await schoolsAPI.create(schoolData);
      } else if (school) {
        await schoolsAPI.update(school.school_no, schoolData);
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
              Policy
            </label>
            <textarea
              name="policy"
              value={formData.policy}
              onChange={handleInputChange}
              rows={3}
              placeholder="School policies, rules, requirements..."
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              Technique
            </label>
            <textarea
              name="technique"
              value={formData.technique}
              onChange={handleInputChange}
              rows={3}
              placeholder="Teaching techniques, methods, approaches..."
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-md font-medium text-black dark:text-white">Class Size Range</h4>
          <div className="grid grid-cols-2 gap-4">
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
          <div className="grid grid-cols-2 gap-4">
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
          <h4 className="mb-4 text-md font-medium text-black dark:text-white">School Features & Services</h4>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { name: 'audit', label: 'Audit Classes' },
              { name: 'coaching', label: 'Coaching' },
              { name: 'showcase', label: 'Showcase' },
              { name: 'bi_coastal', label: 'Bi-Coastal' },
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

        <div>
          <h4 className="mb-4 text-md font-medium text-black dark:text-white">Delivery Methods</h4>
          <div className="grid grid-cols-2 gap-4">
            {[
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
