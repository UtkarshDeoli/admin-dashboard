"use client";

import React, { useState, useEffect } from "react";
import { Company } from "@/types/company";
import { companiesAPI } from "@/lib/api";
import CompanyForm from "./CompanyForm";
import CompanyList from "./CompanyList";

const CompaniesManager: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await companiesAPI.getAll();
      setCompanies(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  // Filter companies based on search term
  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.acronym?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCompany = () => {
    setEditingCompany(null);
    setIsFormOpen(true);
  };

  const handleEditCompany = (company: Company) => {
    setEditingCompany(company);
    setIsFormOpen(true);
  };

  const handleDeleteCompany = async (companyNo: number) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      try {
        await companiesAPI.delete(companyNo);
        await loadCompanies();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete company');
      }
    }
  };

  const handleSaveCompany = async (companyData: Omit<Company, "company_no" | "created_at" | "updated_at">) => {
    try {
      if (editingCompany) {
        await companiesAPI.update(editingCompany.company_no, companyData);
      } else {
        await companiesAPI.create(companyData);
      }
      setIsFormOpen(false);
      setEditingCompany(null);
      await loadCompanies();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save company');
    }
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setEditingCompany(null);
  };

  if (loading) {
    return (
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Companies Management
        </h4>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary sm:w-80"
          />
          <button
            onClick={handleAddCompany}
            className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
          >
            Add Company
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-sm border border-danger bg-danger bg-opacity-10 px-4 py-3 text-danger">
          <p>{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-sm underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {isFormOpen ? (
        <CompanyForm
          company={editingCompany}
          onSubmit={handleSaveCompany}
          onClose={handleCancelForm}
        />
      ) : (
        <CompanyList
          companies={filteredCompanies}
          onEdit={handleEditCompany}
          onDelete={handleDeleteCompany}
        />
      )}
    </div>
  );
};

export default CompaniesManager;
