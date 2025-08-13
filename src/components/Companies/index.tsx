"use client";

import React, { useState, useEffect } from "react";
import { Company } from "@/types/company";
import { companiesAPI } from "@/lib/api";
import CompanyList from "./CompanyList";
import CompanyForm from "./CompanyForm";
import router from "next/router";


export default function CompaniesManager() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      setError('Failed to load companies');
      console.error('Error loading companies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCompany = () => {
    setEditingCompany(null);
    setIsFormOpen(true);
  };

  const handleEditCompany = (company: Company) => {
    router.push(`/companies/${company.company_no}/edit`);
  };

  const handleDeleteCompany = async (companyNo: number) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      try {
        await companiesAPI.delete(companyNo);
        await loadCompanies(); // Reload data after deletion
      } catch (err) {
        console.error('Error deleting company:', err);
        alert('Failed to delete company');
      }
    }
  };

  const handleSaveCompany = async (companyData: Omit<Company, 'company_no' | 'created_at' | 'updated_at'>) => {
    try {
      if (editingCompany) {
        // Update existing company
        await companiesAPI.update(editingCompany.company_no, companyData);
      } else {
        // Create new company
        await companiesAPI.create(companyData);
      }
      await loadCompanies(); // Reload data after save
      setIsFormOpen(false);
      setEditingCompany(null);
    } catch (err) {
      console.error('Error saving company:', err);
      alert('Failed to save company');
    }
  };

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.acronym.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Companies Management
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage company information and settings
          </p>
        </div>
        <button
          onClick={handleAddCompany}
          className="inline-flex items-center justify-center rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
        >
          Add Company
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search companies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        />
      </div>

      <CompanyList
        companies={filteredCompanies}
        onEdit={handleEditCompany}
        onDelete={handleDeleteCompany} onView={function (company: Company): void {
          throw new Error("Function not implemented.");
        } } deleting={[]} 
        onComments={function (company: Company): void {
          throw new Error("Function not implemented.");
        } }      />

      {isFormOpen && (
        <CompanyForm
          company={editingCompany}
          onSave={ handleSaveCompany}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingCompany(null);
          }}
        ></CompanyForm>
      )}
    </div>
  );
}
