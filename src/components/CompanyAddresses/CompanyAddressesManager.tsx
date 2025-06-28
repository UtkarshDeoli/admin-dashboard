"use client";

import React, { useState } from 'react';
import { CompanyAddress } from '@/types/company';
import CompanyAddressList from './CompanyAddressList';
import CompanyAddressForm from './CompanyAddressForm';

const CompanyAddressesManager: React.FC = () => {
  const [companyAddresses, setCompanyAddresses] = useState<CompanyAddress[]>([
    {
      id: 1,
      company_no: 1,
      address_no: 1,
      archived: false,
      locaction: "Main Office"
    },
    {
      id: 2,
      company_no: 1,
      address_no: 2,
      archived: false,
      locaction: "Secondary Office"
    },
    {
      id: 3,
      company_no: 2,
      address_no: 3,
      archived: false,
      locaction: "Headquarters"
    },
    {
      id: 4,
      company_no: 3,
      address_no: 1,
      archived: true,
      locaction: "Former Location"
    },
    {
      id: 5,
      company_no: 2,
      address_no: 4,
      archived: false,
      locaction: "Warehouse"
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingCompanyAddress, setEditingCompanyAddress] = useState<CompanyAddress | undefined>();

  const handleAdd = () => {
    setEditingCompanyAddress(undefined);
    setShowForm(true);
  };

  const handleEdit = (companyAddress: CompanyAddress) => {
    setEditingCompanyAddress(companyAddress);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this company-address association?')) {
      setCompanyAddresses(companyAddresses.filter(ca => ca.id !== id));
    }
  };

  const handleArchive = (id: number) => {
    setCompanyAddresses(companyAddresses.map(ca => 
      ca.id === id ? { ...ca, archived: !ca.archived } : ca
    ));
  };

  const handleSave = (companyAddressData: Omit<CompanyAddress, 'id'> | CompanyAddress) => {
    if ('id' in companyAddressData) {
      // Editing existing company-address association
      setCompanyAddresses(companyAddresses.map(ca => 
        ca.id === companyAddressData.id ? companyAddressData : ca
      ));
    } else {
      // Adding new company-address association
      const newCompanyAddress: CompanyAddress = {
        ...companyAddressData,
        id: Math.max(...companyAddresses.map(ca => ca.id), 0) + 1
      };
      setCompanyAddresses([...companyAddresses, newCompanyAddress]);
    }
    setShowForm(false);
    setEditingCompanyAddress(undefined);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCompanyAddress(undefined);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-black dark:text-white">
            Company-Address Associations
          </h3>
          <button
            onClick={handleAdd}
            className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-4 text-center font-medium text-white hover:bg-opacity-90"
          >
            Add Association
          </button>
        </div>
      </div>

      <div className="p-6.5">
        <CompanyAddressList
          companyAddresses={companyAddresses}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onArchive={handleArchive}
        />
      </div>

      {showForm && (
        <CompanyAddressForm
          companyAddress={editingCompanyAddress}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default CompanyAddressesManager;
