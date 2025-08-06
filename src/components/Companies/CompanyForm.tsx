"use client";

import React, { useState, useEffect } from "react";
import { Company } from "@/types/company";

interface CompanyFormProps {
  company: Company | null;
  onSave: (company: Omit<Company, "company_no" | "created_at" | "updated_at">) => void;
  onCancel: () => void;
  saving?: boolean;
  defaultCompanyType?: string;
}

export default function CompanyForm({ 
  company, 
  onSave, 
  onCancel, 
  saving,
  defaultCompanyType 
}: CompanyFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    fka: "",
    acronym: "",
    verified: false,
    archived: false,
  });

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name,
        description: company.description,
        fka: company.fka,
        acronym: company.acronym,
        verified: company.verified,
        archived: company.archived,
      });
    }
  }, [company, defaultCompanyType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-6.5">
        <div className="mb-4.5">
          <label className="mb-3 block text-sm font-medium text-black dark:text-white">
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
          <label className="mb-3 block text-sm font-medium text-black dark:text-white">
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

        <div className="mb-4.5 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
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

          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
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
        </div>

        <div className="mb-4.5 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="verified"
                checked={formData.verified}
                onChange={handleChange}
                className="sr-only"
              />
              <div
                className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${
                  formData.verified
                    ? "border-primary bg-gray dark:bg-transparent"
                    : "border-stroke dark:border-strokedark"
                }`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-sm ${
                    formData.verified ? "bg-primary" : ""
                  }`}
                ></span>
              </div>
              Verified Company
            </label>
          </div>

          {company && (
            <div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="archived"
                  checked={formData.archived}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div
                  className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${
                    formData.archived
                      ? "border-primary bg-gray dark:bg-transparent"
                      : "border-stroke dark:border-strokedark"
                  }`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-sm ${
                      formData.archived ? "bg-primary" : ""
                    }`}
                  ></span>
                </div>
                Archived
              </label>
            </div>
          )}
        </div>

        <div className="flex gap-4.5">
          <button
            type="submit"
            disabled={saving}
            className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {company ? "Updating..." : "Creating..."}
              </div>
            ) : (
              company ? "Update Company" : "Create Company"
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="flex w-full justify-center rounded border border-stroke p-3 font-medium text-black hover:border-black dark:border-strokedark dark:text-white dark:hover:border-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
