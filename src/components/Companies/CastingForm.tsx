"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Casting, Address } from "@/types/company";
import { castingAPI, addressesAPI } from "@/lib/api";

interface CastingFormProps {
  companyId: number;
  onSave: () => void;
}

export default function CastingForm({ companyId, onSave }: CastingFormProps) {
  const [casting, setCasting] = useState<Casting | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNewCasting, setIsNewCasting] = useState(false);

  const [formData, setFormData] = useState({
    address_no: 0,
    contact1: '',
    contact2: '',
    submission_preference: '',
    casts_for: '',
    seeking: '',
    market: '',
    unions: '',
    talk_variey: false,
    bi_coastal: false,
    primetime: false,
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load addresses for dropdown
      const addressData = await addressesAPI.getAll();
      setAddresses(addressData);
      
      // Try to load existing casting data
      try {
        const castingData = await castingAPI.getByCompany(companyId);
        console.log('Casting data loaded:', castingData);
        if (castingData) {
          setCasting(castingData);
          setFormData({
            address_no: castingData.address_no,
            contact1: castingData.contact1,
            contact2: castingData.contact2,
            submission_preference: castingData.submission_preference,
            casts_for: castingData.casts_for,
            seeking: castingData.seeking,
            market: castingData.market,
            unions: castingData.unions,
            talk_variey: castingData.talk_variey,
            bi_coastal: castingData.bi_coastal,
            primetime: castingData.primetime,
          });
          setIsNewCasting(false);
        } else {
          setIsNewCasting(true);
        }
      } catch (err) {
        setIsNewCasting(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      
      const castingData = {
        company_no: companyId,
        ...formData,
        archived: false
      };
      
      if (isNewCasting) {
        await castingAPI.create(castingData);
      } else if (casting) {
        await castingAPI.update(casting.casting_company_no, castingData);
      }
      
      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save casting data');
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
        Casting Company Information
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
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              Casts For
            </label>
            <textarea
              name="casts_for"
              value={formData.casts_for}
              onChange={handleInputChange}
              rows={4}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              Seeking
            </label>
            <textarea
              name="seeking"
              value={formData.seeking}
              onChange={handleInputChange}
              rows={4}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-md font-medium text-black dark:text-white">Casting Features</h4>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {[
              { name: 'talk_variey', label: 'Talk/Variety' },
              { name: 'bi_coastal', label: 'Bi-Coastal' },
              { name: 'primetime', label: 'Primetime' },
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

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center rounded bg-primary px-6 py-3 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50"
          >
            {saving ? (
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
            ) : null}
            {saving ? 'Saving...' : (isNewCasting ? 'Create Casting Company' : 'Update Casting Company')}
          </button>
        </div>
      </form>
    </div>
  );
}
