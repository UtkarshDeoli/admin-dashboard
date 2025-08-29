"use client";

import React, { useState, useEffect } from "react";
import { Agency, Company, Address } from "@/types/company";

interface AgencyModalFormProps {
  agency: Agency | null;
  onSave: (agency: Omit<Agency, "agency_no">) => void;
  onCancel: () => void;
  saving?: boolean;
}

export default function AgencyModalForm({ 
  agency, 
  onSave, 
  onCancel, 
  saving
}: AgencyModalFormProps) {
  const [formData, setFormData] = useState({
    company_no: 0,
    address_no: 0,
    contact1: "",
    contact2: "",
    unions: "",
    submission_preference: "",
    represents: "",
    does_not_represent: "",
    market: "",
    seeks: "",
    literary_only: false,
    bi_coastal: false,
    freelance: false,
    talent: false,
    seeking: false,
    represents_min_agee: 0,
    represents_max_age: 0,
    seeking_min_age: 0,
    seeking_max_age: 0,
    archived: false,
  });

  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [companySearch, setCompanySearch] = useState("");
  const [companySuggestions, setCompanySuggestions] = useState<Company[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchingCompanies, setSearchingCompanies] = useState(false);
  
  // Address state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  useEffect(() => {
    // Load addresses on component mount
    loadAddresses();
    
    if (agency) {
      setFormData({
        company_no: agency.company_no,
        address_no: agency.address_no,
        contact1: agency.contact1,
        contact2: agency.contact2,
        unions: agency.unions,
        submission_preference: agency.submission_preference,
        represents: agency.represents,
        does_not_represent: agency.does_not_represent,
        market: agency.market,
        seeks: agency.seeks,
        literary_only: agency.literary_only,
        bi_coastal: agency.bi_coastal,
        freelance: agency.freelance,
        talent: agency.talent,
        seeking: agency.seeking,
        represents_min_agee: agency.represents_min_agee,
        represents_max_age: agency.represents_max_age,
        seeking_min_age: agency.seeking_min_age,
        seeking_max_age: agency.seeking_max_age,
        archived: agency.archived,
      });
      
      // Load the company name for editing
      if (agency.company_no) {
        loadCompanyName(agency.company_no);
      }
    }
  }, [agency]);

  const loadAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const response = await fetch('/api/addresses');
      if (response.ok) {
        const addressData = await response.json();
        setAddresses(addressData);
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const loadCompanyName = async (companyNo: number) => {
    try {
      const response = await fetch(`/api/companies/${companyNo}`);
      if (response.ok) {
        const company = await response.json();
        setSelectedCompany(company);
        setCompanySearch(company.name);
      }
    } catch (error) {
      console.error('Error loading company:', error);
    }
  };

  const searchCompanies = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setCompanySuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      setSearchingCompanies(true);
      const response = await fetch(`/api/companies/search?query=${encodeURIComponent(searchTerm)}`);
      if (response.ok) {
        const companies = await response.json();
        setCompanySuggestions(companies.slice(0, 10)); // Limit to 10 suggestions
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Error searching companies:', error);
    } finally {
      setSearchingCompanies(false);
    }
  };

  const handleCompanySearch = (value: string) => {
    setCompanySearch(value);
    if (!selectedCompany || value !== selectedCompany.name) {
      setSelectedCompany(null);
      setFormData(prev => ({ ...prev, company_no: 0 }));
    }
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      searchCompanies(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const selectCompany = (company: Company) => {
    setSelectedCompany(company);
    setCompanySearch(company.name);
    setFormData(prev => ({ ...prev, company_no: company.company_no }));
    setShowSuggestions(false);
    setCompanySuggestions([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCompany) {
      alert('Please select a company from the suggestions');
      return;
    }
    
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : 
              type === "number" ? (value === "" ? 0 : parseInt(value)) : value
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-6.5">
        {/* Company Selection */}
        <div className="mb-4.5 relative">
          <label className="mb-3 block text-sm font-medium text-black dark:text-white">
            Company <span className="text-meta-1">*</span>
          </label>
          <input
            type="text"
            value={companySearch}
            onChange={(e) => handleCompanySearch(e.target.value)}
            required
            placeholder="Search and select a company..."
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
          
          {/* Company Suggestions Dropdown */}
          {showSuggestions && companySuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-boxdark border border-stroke dark:border-strokedark rounded shadow-lg max-h-60 overflow-y-auto">
              {companySuggestions.map((company) => (
                <div
                  key={company.company_no}
                  onClick={() => selectCompany(company)}
                  className="p-3 hover:bg-gray-100 dark:hover:bg-meta-4 cursor-pointer border-b border-stroke dark:border-strokedark last:border-b-0"
                >
                  <div className="font-medium text-black dark:text-white">{company.name}</div>
                  {company.description && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {company.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {searchingCompanies && (
            <div className="absolute right-3 top-12 animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          )}
          
          {selectedCompany && (
            <div className="mt-2 p-2 bg-success bg-opacity-10 text-success rounded text-sm">
              Selected: {selectedCompany.name}
            </div>
          )}
        </div>

        {/* Address Selection */}
        <div className="mb-4.5">
          <label className="mb-3 block text-sm font-medium text-black dark:text-white">
            Address
          </label>
          <select
            name="address_no"
            value={formData.address_no}
            onChange={handleChange}
            disabled={loadingAddresses}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          >
            <option value={0}>No address</option>
            {addresses.map((address) => (
              <option key={address.address_no} value={address.address_no}>
                {`${address.line1}${address.line2 ? ', ' + address.line2 : ''}, ${address.city}, ${address.state} ${address.zip}`}
              </option>
            ))}
          </select>
          {loadingAddresses && (
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Loading addresses...
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="mb-4.5 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Contact 1
            </label>
            <input
              type="text"
              name="contact1"
              value={formData.contact1}
              onChange={handleChange}
              placeholder="Enter primary contact"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Contact 2
            </label>
            <input
              type="text"
              name="contact2"
              value={formData.contact2}
              onChange={handleChange}
              placeholder="Enter secondary contact"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>
        </div>

        {/* Unions and Submission Preference */}
        <div className="mb-4.5 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Unions
            </label>
            <input
              type="text"
              name="unions"
              value={formData.unions}
              onChange={handleChange}
              placeholder="Enter unions"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Submission Preference
            </label>
            <input
              type="text"
              name="submission_preference"
              value={formData.submission_preference}
              onChange={handleChange}
              placeholder="Enter submission preference"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>
        </div>

        {/* Represents and Does Not Represent */}
        <div className="mb-4.5">
          <label className="mb-3 block text-sm font-medium text-black dark:text-white">
            Represents
          </label>
          <textarea
            name="represents"
            value={formData.represents}
            onChange={handleChange}
            rows={3}
            placeholder="Enter what the agency represents"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>

        <div className="mb-4.5">
          <label className="mb-3 block text-sm font-medium text-black dark:text-white">
            Does Not Represent
          </label>
          <textarea
            name="does_not_represent"
            value={formData.does_not_represent}
            onChange={handleChange}
            rows={3}
            placeholder="Enter what the agency does not represent"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>

        {/* Market and Seeks */}
        <div className="mb-4.5 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Market
            </label>
            <input
              type="text"
              name="market"
              value={formData.market}
              onChange={handleChange}
              placeholder="Enter market"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Seeks
            </label>
            <input
              type="text"
              name="seeks"
              value={formData.seeks}
              onChange={handleChange}
              placeholder="Enter what the agency seeks"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>
        </div>

        {/* Age Ranges */}
        <div className="mb-4.5">
          <h3 className="mb-3 text-sm font-medium text-black dark:text-white">Age Ranges</h3>
          <div className="grid grid-cols-2 gap-6 xl:grid-cols-4">
            <div>
              <label className="mb-2 block text-xs font-medium text-black dark:text-white">
                Represents Min Age
              </label>
              <input
                type="number"
                name="represents_min_agee"
                value={formData.represents_min_agee}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium text-black dark:text-white">
                Represents Max Age
              </label>
              <input
                type="number"
                name="represents_max_age"
                value={formData.represents_max_age}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium text-black dark:text-white">
                Seeking Min Age
              </label>
              <input
                type="number"
                name="seeking_min_age"
                value={formData.seeking_min_age}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium text-black dark:text-white">
                Seeking Max Age
              </label>
              <input
                type="number"
                name="seeking_max_age"
                value={formData.seeking_max_age}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Boolean Fields */}
        <div className="mb-4.5">
          <h3 className="mb-3 text-sm font-medium text-black dark:text-white">Options</h3>
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="literary_only"
                checked={formData.literary_only}
                onChange={handleChange}
                className="sr-only"
              />
              <div
                className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${
                  formData.literary_only
                    ? "border-primary bg-gray dark:bg-transparent"
                    : "border-stroke dark:border-strokedark"
                }`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-sm ${
                    formData.literary_only ? "bg-primary" : ""
                  }`}
                ></span>
              </div>
              Literary Only
            </label>

            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="bi_coastal"
                checked={formData.bi_coastal}
                onChange={handleChange}
                className="sr-only"
              />
              <div
                className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${
                  formData.bi_coastal
                    ? "border-primary bg-gray dark:bg-transparent"
                    : "border-stroke dark:border-strokedark"
                }`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-sm ${
                    formData.bi_coastal ? "bg-primary" : ""
                  }`}
                ></span>
              </div>
              Bi-Coastal
            </label>

            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="freelance"
                checked={formData.freelance}
                onChange={handleChange}
                className="sr-only"
              />
              <div
                className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${
                  formData.freelance
                    ? "border-primary bg-gray dark:bg-transparent"
                    : "border-stroke dark:border-strokedark"
                }`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-sm ${
                    formData.freelance ? "bg-primary" : ""
                  }`}
                ></span>
              </div>
              Freelance
            </label>

            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="talent"
                checked={formData.talent}
                onChange={handleChange}
                className="sr-only"
              />
              <div
                className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${
                  formData.talent
                    ? "border-primary bg-gray dark:bg-transparent"
                    : "border-stroke dark:border-strokedark"
                }`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-sm ${
                    formData.talent ? "bg-primary" : ""
                  }`}
                ></span>
              </div>
              Talent
            </label>

            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="seeking"
                checked={formData.seeking}
                onChange={handleChange}
                className="sr-only"
              />
              <div
                className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${
                  formData.seeking
                    ? "border-primary bg-gray dark:bg-transparent"
                    : "border-stroke dark:border-strokedark"
                }`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-sm ${
                    formData.seeking ? "bg-primary" : ""
                  }`}
                ></span>
              </div>
              Seeking
            </label>

            {agency && (
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
            )}
          </div>
        </div>

        <div className="flex gap-4.5">
          <button
            type="submit"
            disabled={saving || !selectedCompany}
            className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {agency ? "Updating..." : "Creating..."}
              </div>
            ) : (
              agency ? "Update Agency" : "Create Agency"
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
