"use client";

import React, { useState, useEffect } from "react";
import { Agency, Address } from "@/types/company";
import { agenciesAPI, addressesAPI } from "@/lib/api";

interface AgencyFormProps {
  companyId: number;
  onSave: () => void;
}

export default function AgencyForm({ companyId, onSave }: AgencyFormProps) {
  const [agency, setAgency] = useState<Agency | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNewAgency, setIsNewAgency] = useState(false);

  const [formData, setFormData] = useState({
    address_no: 0,
    contact1: '',
    contact2: '',
    unions: '',
    submission_preference: '',
    represents: '',
    does_not_represent: '',
    market: '',
    seeks: '',
    literary_only: false,
    bi_coastal: false,
    freelance: false,
    talent: false,
    seeking: false,
    represents_min_agee: 0,
    represents_max_age: 0,
    seeking_min_age: 0,
    seeking_max_age: 0,
  });

  useEffect(() => {
    loadData();
  }, [companyId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load addresses for dropdown
      const addressData = await addressesAPI.getAll();
      setAddresses(addressData);
      
      // Try to load existing agency data
      try {
        const agencyData = await agenciesAPI.getByCompany(companyId);
        if (agencyData) {
          setAgency(agencyData);
          setFormData({
            address_no: agencyData.address_no,
            contact1: agencyData.contact1,
            contact2: agencyData.contact2,
            unions: agencyData.unions,
            submission_preference: agencyData.submission_preference,
            represents: agencyData.represents,
            does_not_represent: agencyData.does_not_represent,
            market: agencyData.market,
            seeks: agencyData.seeks,
            literary_only: agencyData.literary_only,
            bi_coastal: agencyData.bi_coastal,
            freelance: agencyData.freelance,
            talent: agencyData.talent,
            seeking: agencyData.seeking,
            represents_min_agee: agencyData.represents_min_agee,
            represents_max_age: agencyData.represents_max_age,
            seeking_min_age: agencyData.seeking_min_age,
            seeking_max_age: agencyData.seeking_max_age,
          });
          setIsNewAgency(false);
        } else {
          setIsNewAgency(true);
        }
      } catch (err) {
        // Agency doesn't exist yet, this is fine for new companies
        setIsNewAgency(true);
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
      
      const agencyData = {
        company_no: companyId,
        ...formData,
        archived: false
      };
      
      if (isNewAgency) {
        await agenciesAPI.create(agencyData);
      } else if (agency) {
        await agenciesAPI.update(agency.agency_no, agencyData);
      }
      
      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save agency data');
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
        Agency Information
      </h3>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Address Selection */}
          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              Primary Address
            </label>
            <select
              name="address_no"
              value={formData.address_no}
              onChange={handleInputChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            >
              <option value={0}>Select an address</option>
              {addresses.map((address) => (
                <option key={address.address_no} value={address.address_no}>
                  {address.line1}, {address.city}, {address.state}
                </option>
              ))}
            </select>
          </div>

          {/* Contact 1 */}
          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              Primary Contact
            </label>
            <input
              type="text"
              name="contact1"
              value={formData.contact1}
              onChange={handleInputChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          {/* Contact 2 */}
          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              Secondary Contact
            </label>
            <input
              type="text"
              name="contact2"
              value={formData.contact2}
              onChange={handleInputChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          {/* Submission Preference */}
          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              Submission Preference
            </label>
            <input
              type="text"
              name="submission_preference"
              value={formData.submission_preference}
              onChange={handleInputChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          {/* Unions */}
          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              Unions
            </label>
            <input
              type="text"
              name="unions"
              value={formData.unions}
              onChange={handleInputChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          {/* Market */}
          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              Market
            </label>
            <input
              type="text"
              name="market"
              value={formData.market}
              onChange={handleInputChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>
        </div>

        {/* Age Ranges */}
        <div>
          <h4 className="mb-4 text-md font-medium text-black dark:text-white">Age Ranges</h4>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Represents Min Age
              </label>
              <input
                type="number"
                name="represents_min_age"
                value={formData.represents_min_agee}
                onChange={handleInputChange}
                min="0"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Represents Max Age
              </label>
              <input
                type="number"
                name="represents_max_age"
                value={formData.represents_max_age}
                onChange={handleInputChange}
                min="0"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Seeking Min Age
              </label>
              <input
                type="number"
                name="seeking_min_age"
                value={formData.seeking_min_age}
                onChange={handleInputChange}
                min="0"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Seeking Max Age
              </label>
              <input
                type="number"
                name="seeking_max_age"
                value={formData.seeking_max_age}
                onChange={handleInputChange}
                min="0"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Text Areas */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              Represents
            </label>
            <textarea
              name="represents"
              value={formData.represents}
              onChange={handleInputChange}
              rows={4}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              Does Not Represent
            </label>
            <textarea
              name="does_not_represent"
              value={formData.does_not_represent}
              onChange={handleInputChange}
              rows={4}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-black dark:text-white">
            Seeks
          </label>
          <textarea
            name="seeks"
            value={formData.seeks}
            onChange={handleInputChange}
            rows={3}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>

        {/* Checkboxes */}
        <div>
          <h4 className="mb-4 text-md font-medium text-black dark:text-white">Agency Features</h4>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {[
              { name: 'literary_only', label: 'Literary Only' },
              { name: 'bi_coastal', label: 'Bi-Coastal' },
              { name: 'freelance', label: 'Freelance' },
              { name: 'talent', label: 'Talent' },
              { name: 'seeking', label: 'Seeking' },
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

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center rounded bg-primary px-6 py-3 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50"
          >
            {saving ? (
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
            ) : null}
            {saving ? 'Saving...' : (isNewAgency ? 'Create Agency' : 'Update Agency')}
          </button>
        </div>
      </form>
    </div>
  );
}
