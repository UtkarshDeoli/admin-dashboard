"use client";

import React, { useState, useEffect } from "react";
import { Company } from "@/types/company";
import CompanyList from "./CompanyList";
import CompanyForm from "./CompanyForm";

// Mock data - replace with API calls later
const mockCompanies: Company[] = [
  {
    company_no: 1,
    name: "ABC Productions",
    description: "Leading film production company",
    fka: "ABC Films",
    acronym: "ABC",
    verified: true,
    created_at: "2024-01-15",
    updated_at: "2024-06-20"
  },
  {
    company_no: 2,
    name: "XYZ Entertainment",
    description: "Television and streaming content producer",
    fka: "",
    acronym: "XYZ",
    verified: false,
    created_at: "2024-02-10",
    updated_at: "2024-06-15"
  },
  {
    company_no: 3,
    name: "Broadway Theaters Inc",
    description: "Theater management and production",
    fka: "Broadway Management",
    acronym: "BTI",
    verified: true,
    created_at: "2024-03-05",
    updated_at: "2024-06-22"
  },
];

export default function CompaniesManager() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Simulate API call
    setCompanies(mockCompanies);
  }, []);

  const handleAddCompany = () => {
    setEditingCompany(null);
    setIsFormOpen(true);
  };

  const handleEditCompany = (company: Company) => {
    setEditingCompany(company);
    setIsFormOpen(true);
  };

  const handleDeleteCompany = (companyNo: number) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      setCompanies(companies.filter(c => c.company_no !== companyNo));
    }
  };

  const handleSaveCompany = (companyData: Omit<Company, 'company_no'>) => {
    if (editingCompany) {
      // Update existing company
      setCompanies(companies.map(c => 
        c.company_no === editingCompany.company_no 
          ? { ...companyData, company_no: editingCompany.company_no }
          : c
      ));
    } else {
      // Add new company
      const newCompany: Company = {
        ...companyData,
        company_no: Math.max(...companies.map(c => c.company_no), 0) + 1,
      };
      setCompanies([...companies, newCompany]);
    }
    setIsFormOpen(false);
    setEditingCompany(null);
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
        onDelete={handleDeleteCompany}
      />

      {isFormOpen && (
        <CompanyForm
          company={editingCompany}
          onSubmit={handleSaveCompany}
          onClose={() => {
            setIsFormOpen(false);
            setEditingCompany(null);
          }}
        />
      )}
    </div>
  );
}
