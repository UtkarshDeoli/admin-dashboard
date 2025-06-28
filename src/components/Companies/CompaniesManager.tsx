"use client";

import React, { useState, useEffect } from "react";
import { Company } from "@/types/company";
import CompanyList from "./CompanyList";
import CompanyForm from "./CompanyForm";

// Mock data for companies
const mockCompanies: Company[] = [
  {
    company_no: 1,
    name: "Tech Innovations Inc.",
    description: "Leading technology solutions provider",
    fka: "Tech Solutions Ltd.",
    acronym: "TII",
    verified: true,
    created_at: "2024-01-15",
    updated_at: "2024-06-20"
  },
  {
    company_no: 2,
    name: "Global Enterprises",
    description: "International business consulting firm",
    fka: "",
    acronym: "GE",
    verified: false,
    created_at: "2024-02-10",
    updated_at: "2024-06-15"
  },
  {
    company_no: 3,
    name: "Creative Studios",
    description: "Digital marketing and design agency",
    fka: "Creative Works",
    acronym: "CS",
    verified: true,
    created_at: "2024-03-05",
    updated_at: "2024-06-22"
  }
];

const CompaniesManager: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter companies based on search term
  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.acronym.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      setCompanies(companies.filter((c) => c.company_no !== companyNo));
    }
  };

  const handleSaveCompany = (companyData: Omit<Company, "company_no">) => {
    if (editingCompany) {
      // Update existing company
      setCompanies(
        companies.map((c) =>
          c.company_no === editingCompany.company_no
            ? { ...companyData, company_no: editingCompany.company_no }
            : c
        )
      );
    } else {
      // Add new company
      const newCompany: Company = {
        ...companyData,
        company_no: Math.max(...companies.map((c) => c.company_no)) + 1,
        created_at: new Date().toISOString().split("T")[0],
        updated_at: new Date().toISOString().split("T")[0],
      };
      setCompanies([...companies, newCompany]);
    }
    setIsFormOpen(false);
    setEditingCompany(null);
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setEditingCompany(null);
  };

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

      {isFormOpen ? (
        <CompanyForm
          company={editingCompany}
          onSave={handleSaveCompany}
          onCancel={handleCancelForm}
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
