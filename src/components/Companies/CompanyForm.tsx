"use client";

import React, { useState, useEffect } from "react";
import { Company } from "@/types/company";

interface CompanyFormProps {
  company: Company | null;
  onSubmit: (company: Company | Omit<Company, 'company_no'>) => void;
  onClose: () => void;
}

export default function CompanyForm({ company, onSubmit, onClose }: CompanyFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    fka: "",
    acronym: "",
    verified: false,
  });

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name,
        description: company.description,
        fka: company.fka,
        acronym: company.acronym,
        verified: company.verified,
      });
    }
  }, [company]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (company) {
      onSubmit({ ...formData, company_no: company.company_no });
    } else {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-boxdark rounded-sm border border-stroke dark:border-strokedark shadow-default w-full max-w-md mx-4">
        <div className="border-b border-stroke dark:border-strokedark py-4 px-6.5">
          <h3 className="font-medium text-black dark:text-white">
            {company ? "Edit Company" : "Add New Company"}
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6.5">
          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Company Name <span className="text-meta-1">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter company name"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Enter company description"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Formerly Known As (FKA)
            </label>
            <input
              type="text"
              name="fka"
              value={formData.fka}
              onChange={handleChange}
              placeholder="Enter former name"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Acronym
            </label>
            <input
              type="text"
              name="acronym"
              value={formData.acronym}
              onChange={handleChange}
              placeholder="Enter acronym"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          <div className="mb-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="verified"
                checked={formData.verified}
                onChange={handleChange}
                className="sr-only"
              />
              <div className="relative">
                <div className={`w-5 h-5 rounded border-2 ${formData.verified ? 'bg-primary border-primary' : 'border-stroke dark:border-strokedark'}`}>
                  {formData.verified && (
                    <svg
                      className="w-3 h-3 text-white absolute top-0.5 left-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <span className="ml-3 text-black dark:text-white">Verified</span>
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
            >
              {company ? "Update Company" : "Add Company"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex w-full justify-center rounded border border-stroke p-3 font-medium text-black hover:bg-gray-2 dark:border-strokedark dark:text-white dark:hover:bg-meta-4"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
