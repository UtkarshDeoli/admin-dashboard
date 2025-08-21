"use client";

import React, { useState, useEffect } from "react";
import { School, Company, Address } from "@/types/company";

interface SchoolModalFormProps {
    school: School | null;
    onSave: (school: Omit<School, "school_no">) => void;
    onCancel: () => void;
    saving?: boolean;
}

export default function SchoolModalForm({
    school,
    onSave,
    onCancel,
    saving
}: SchoolModalFormProps) {
    const [formData, setFormData] = useState({
        school_no: school?.school_no || 0,
        company_no: school?.company_no || 0,
        policy: school?.policy || '',
        technique: school?.technique || '',
        audit: school?.audit || false,
        coaching: school?.coaching || false,
        showcase: school?.showcase || false,
        bi_coastal: school?.bi_coastal || false,
        online: school?.online || false,
        in_person: school?.in_person || false,
        class_size_min: school?.class_size_min || 0,
        class_size_max: school?.class_size_max || 0,
        age_min: school?.age_min || 0,
        age_max: school?.age_max || 0,
        archived: school?.archived || false,
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

        if (school) {
            setFormData({
                school_no: school?.school_no || 0,
                company_no: school?.company_no || 0,
                policy: school?.policy || '',
                technique: school?.technique || '',
                audit: school?.audit || false,
                coaching: school?.coaching || false,
                showcase: school?.showcase || false,
                bi_coastal: school?.bi_coastal || false,
                online: school?.online || false,
                in_person: school?.in_person || false,
                class_size_min: school?.class_size_min || 0,
                class_size_max: school?.class_size_max || 0,
                age_min: school?.age_min || 0,
                age_max: school?.age_max || 0,
                archived: school?.archived || false,
            });

            // Load the company name for editing
            if (school.company_no) {
                loadCompanyName(school.company_no);
            }
        }
    }, [school]);

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
                        value={"No address Field in School"}
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



                {/* Unions and Submission Preference */}
                <div className="mb-4.5 grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <div>
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                            Policy
                        </label>
                        <input
                            type="text"
                            name="policy"
                            value={formData.policy}
                            onChange={handleChange}
                            placeholder="Enter unions"
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                            Technique
                        </label>
                        <input
                            type="text"
                            name="technique"
                            value={formData.technique}
                            onChange={handleChange}
                            placeholder="Enter technique"
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
                                Represents Min Class Size
                            </label>
                            <input
                                type="number"
                                name="class_size_min"
                                value={formData.class_size_min}
                                onChange={handleChange}
                                min="0"
                                max="100"
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-xs font-medium text-black dark:text-white">
                                Represents Max Class Size
                            </label>
                            <input
                                type="number"
                                name="class_size_max"
                                value={formData.class_size_max}
                                onChange={handleChange}
                                min="0"
                                max="100"
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-xs font-medium text-black dark:text-white">
                                Min Age
                            </label>
                            <input
                                type="number"
                                name="age_min"
                                value={formData.age_min}
                                onChange={handleChange}
                                min="0"
                                max="100"
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-xs font-medium text-black dark:text-white">
                                Max Age
                            </label>
                            <input
                                type="number"
                                name="age_max"
                                value={formData.age_max}
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
                                name="audit"
                                checked={formData.audit}
                                onChange={handleChange}
                                className="sr-only"
                            />
                            <div
                                className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${formData.audit
                                    ? "border-primary bg-gray dark:bg-transparent"
                                    : "border-stroke dark:border-strokedark"
                                    }`}
                            >
                                <span
                                    className={`h-2.5 w-2.5 rounded-sm ${formData.audit ? "bg-primary" : ""
                                        }`}
                                ></span>
                            </div>
                            Audit
                        </label>

                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="coaching"
                                checked={formData.coaching}
                                onChange={handleChange}
                                className="sr-only"
                            />
                            <div
                                className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${formData.coaching
                                    ? "border-primary bg-gray dark:bg-transparent"
                                    : "border-stroke dark:border-strokedark"
                                    }`}
                            >
                                <span
                                    className={`h-2.5 w-2.5 rounded-sm ${formData.coaching ? "bg-primary" : ""
                                        }`}
                                ></span>
                            </div>
                            Bi-Coastal
                        </label>

                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="showcase"
                                checked={formData.showcase}
                                onChange={handleChange}
                                className="sr-only"
                            />
                            <div
                                className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${formData.showcase
                                    ? "border-primary bg-gray dark:bg-transparent"
                                    : "border-stroke dark:border-strokedark"
                                    }`}
                            >
                                <span
                                    className={`h-2.5 w-2.5 rounded-sm ${formData.showcase ? "bg-primary" : ""
                                        }`}
                                ></span>
                            </div>
                            Showcase
                        </label>

                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="online"
                                checked={formData.online}
                                onChange={handleChange}
                                className="sr-only"
                            />
                            <div
                                className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${formData.online
                                    ? "border-primary bg-gray dark:bg-transparent"
                                    : "border-stroke dark:border-strokedark"
                                    }`}
                            >
                                <span
                                    className={`h-2.5 w-2.5 rounded-sm ${formData.online ? "bg-primary" : ""
                                        }`}
                                ></span>
                            </div>
                            Online
                        </label>

                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="in_person"
                                checked={formData.in_person}
                                onChange={handleChange}
                                className="sr-only"
                            />
                            <div
                                className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${formData.in_person
                                    ? "border-primary bg-gray dark:bg-transparent"
                                    : "border-stroke dark:border-strokedark"
                                    }`}
                            >
                                <span
                                    className={`h-2.5 w-2.5 rounded-sm ${formData.in_person ? "bg-primary" : ""
                                        }`}
                                ></span>
                            </div>
                            In-person
                        </label>



                        {school && (
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
                                {school ? "Updating..." : "Creating..."}
                            </div>
                        ) : (
                            school ? "Update Agency" : "Create Agency"
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
