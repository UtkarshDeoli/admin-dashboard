"use client";

import React, { useState, useEffect } from "react";
import { Theater, Company, Address } from "@/types/company";

interface TheaterModalFormProps {
    theater: Theater | null;
    onSave: (theater: Omit<Theater, "theater_no">) => void;
    onCancel: () => void;
    saving?: boolean;
}

export default function TheaterModalForm({
    theater,
    onSave,
    onCancel,
    saving
}: TheaterModalFormProps) {
    const [formData, setFormData] = useState({
        theater_no: theater?.theater_no || 0,
        company_no: theater?.company_no || 0,
        submission_preference: theater?.submission_preference || '',
        literary_submission_preference: theater?.literary_submission_preference || '',
        contract: theater?.contract || '',
        production_compnay: theater?.production_compnay || false,
        summer: theater?.summer || false,
        musical: theater?.musical || false,
        community: theater?.community || false,
        outdoor: theater?.outdoor || false,
        archived: theater?.archived || false,
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

        if (theater) {
            setFormData({
                theater_no: theater.theater_no || 0,
                company_no: theater.company_no || 0,
                submission_preference: theater.submission_preference || '',
                literary_submission_preference: theater.literary_submission_preference || '',
                contract: theater.contract || '',
                production_compnay: theater.production_compnay || false,
                summer: theater.summer || false,
                musical: theater.musical || false,
                community: theater.community || false,
                outdoor: theater.outdoor || false,
                archived: theater.archived || false,
            });

            // Load the company name for editing
            if (theater.company_no) {
                loadCompanyName(theater.company_no);
            }
        }
    }, [theater]);

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
                        value={"No address_no Field"}
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
                            Contract
                        </label>
                        <input
                            type="text"
                            name="contact1"
                            value={formData.contract}
                            onChange={handleChange}
                            placeholder="Enter primary contact"
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>

                </div>

                {/* Unions and Submission Preference */}
                <div className="mb-4.5 grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <div>
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                            Literary Submission Preference
                        </label>
                        <input
                            type="text"
                            name="literary_submission_preference"
                            value={formData.literary_submission_preference}
                            onChange={handleChange}
                            placeholder="Enter literary submission preference"
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



                {/* Boolean Fields */}
                <div className="mb-4.5">
                    <h3 className="mb-3 text-sm font-medium text-black dark:text-white">Options</h3>
                    <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="production_compnay"
                                checked={formData.production_compnay}
                                onChange={handleChange}
                                className="sr-only"
                            />
                            <div
                                className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${formData.production_compnay
                                    ? "border-primary bg-gray dark:bg-transparent"
                                    : "border-stroke dark:border-strokedark"
                                    }`}
                            >
                                <span
                                    className={`h-2.5 w-2.5 rounded-sm ${formData.production_compnay ? "bg-primary" : ""
                                        }`}
                                ></span>
                            </div>
                            Production Company
                        </label>

                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="summer"
                                checked={formData.summer}
                                onChange={handleChange}
                                className="sr-only"
                            />
                            <div
                                className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${formData.summer
                                    ? "border-primary bg-gray dark:bg-transparent"
                                    : "border-stroke dark:border-strokedark"
                                    }`}
                            >
                                <span
                                    className={`h-2.5 w-2.5 rounded-sm ${formData.summer ? "bg-primary" : ""
                                        }`}
                                ></span>
                            </div>
                            Summer
                        </label>

                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="musical"
                                checked={formData.musical}
                                onChange={handleChange}
                                className="sr-only"
                            />
                            <div
                                className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${formData.musical
                                    ? "border-primary bg-gray dark:bg-transparent"
                                    : "border-stroke dark:border-strokedark"
                                    }`}
                            >
                                <span
                                    className={`h-2.5 w-2.5 rounded-sm ${formData.musical ? "bg-primary" : ""
                                        }`}
                                ></span>
                            </div>
                            Musical
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="community"
                                checked={formData.community}
                                onChange={handleChange}
                                className="sr-only"
                            />
                            <div
                                className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${formData.community
                                    ? "border-primary bg-gray dark:bg-transparent"
                                    : "border-stroke dark:border-strokedark"
                                    }`}
                            >
                                <span
                                    className={`h-2.5 w-2.5 rounded-sm ${formData.community ? "bg-primary" : ""
                                        }`}
                                ></span>
                            </div>
                            Community
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="outdoor"
                                checked={formData.outdoor}
                                onChange={handleChange}
                                className="sr-only"
                            />
                            <div
                                className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${formData.outdoor
                                    ? "border-primary bg-gray dark:bg-transparent"
                                    : "border-stroke dark:border-strokedark"
                                    }`}
                            >
                                <span
                                    className={`h-2.5 w-2.5 rounded-sm ${formData.outdoor ? "bg-primary" : ""
                                        }`}
                                ></span>
                            </div>
                            Outdoor
                        </label>

                        {/* <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="archived"
                                checked={formData.archived}
                                onChange={handleChange}
                                className="sr-only"
                            />
                            <div
                                className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${formData.archived
                                    ? "border-primary bg-gray dark:bg-transparent"
                                    : "border-stroke dark:border-strokedark"
                                    }`}
                            >
                                <span
                                    className={`h-2.5 w-2.5 rounded-sm ${formData.archived ? "bg-primary" : ""
                                        }`}
                                ></span>
                            </div>
                            Archived
                        </label> */}



                        {theater && (
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="archived"
                                    checked={formData.archived}
                                    onChange={handleChange}
                                    className="sr-only"
                                />
                                <div
                                    className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${formData.archived
                                        ? "border-primary bg-gray dark:bg-transparent"
                                        : "border-stroke dark:border-strokedark"
                                        }`}
                                >
                                    <span
                                        className={`h-2.5 w-2.5 rounded-sm ${formData.archived ? "bg-primary" : ""
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
                                {theater ? "Updating..." : "Creating..."}
                            </div>
                        ) : (
                            theater ? "Update Theater" : "Create Theater"
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
