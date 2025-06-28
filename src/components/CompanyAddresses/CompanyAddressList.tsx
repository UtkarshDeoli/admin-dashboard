"use client";

import React, { useState } from 'react';
import { CompanyAddress } from '@/types/company';

interface CompanyAddressListProps {
  companyAddresses: CompanyAddress[];
  onEdit: (companyAddress: CompanyAddress) => void;
  onDelete: (id: number) => void;
  onArchive: (id: number) => void;
}

const CompanyAddressList: React.FC<CompanyAddressListProps> = ({ 
  companyAddresses, 
  onEdit, 
  onDelete, 
  onArchive 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  const filteredCompanyAddresses = companyAddresses.filter(ca => {
    const matchesSearch = 
      ca.company_no.toString().includes(searchTerm) ||
      ca.address_no.toString().includes(searchTerm) ||
      ca.locaction.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesArchiveFilter = showArchived || !ca.archived;
    
    return matchesSearch && matchesArchiveFilter;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by company ID, address ID, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-strokedark dark:bg-meta-4 dark:text-white"
          />
        </div>
        <div className="flex items-center">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showArchived}
              onChange={(e) => setShowArchived(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Show Archived</span>
          </label>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="px-4 py-4 font-medium text-black dark:text-white">Association ID</th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">Company ID</th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">Address ID</th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">Location</th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">Status</th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompanyAddresses.map((ca) => (
              <tr key={ca.id} className="border-b border-stroke dark:border-strokedark">
                <td className="px-4 py-4 text-black dark:text-white">
                  {ca.id}
                </td>
                <td className="px-4 py-4 text-black dark:text-white">
                  {ca.company_no}
                </td>
                <td className="px-4 py-4 text-black dark:text-white">
                  {ca.address_no}
                </td>
                <td className="px-4 py-4 text-black dark:text-white">
                  {ca.locaction}
                </td>
                <td className="px-4 py-4">
                  {ca.archived ? (
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                      Archived
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      Active
                    </span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEdit(ca)}
                      className="inline-flex items-center justify-center rounded bg-primary py-1 px-2 text-center font-medium text-white hover:bg-opacity-90 text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onArchive(ca.id)}
                      className={`inline-flex items-center justify-center rounded py-1 px-2 text-center font-medium text-xs ${
                        ca.archived 
                          ? 'bg-green-600 text-white hover:bg-green-700' 
                          : 'bg-yellow-600 text-white hover:bg-yellow-700'
                      }`}
                    >
                      {ca.archived ? 'Restore' : 'Archive'}
                    </button>
                    <button
                      onClick={() => onDelete(ca.id)}
                      className="inline-flex items-center justify-center rounded bg-red-600 py-1 px-2 text-center font-medium text-white hover:bg-red-700 text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredCompanyAddresses.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No company-address associations found.
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyAddressList;
