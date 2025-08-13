"use client";

import React from "react";
import { Address } from "@/types/company";

interface CompanyAddressListProps {
  addresses: Address[];
  onView: (address: Address) => void;
  onEdit: (address: Address) => void;
  onArchive: (addressNo: number, isArchived: boolean) => void;
  onDelete: (addressNo: number) => void;
  deleting: number | null;
  archiving: number | null;
}

export default function CompanyAddressList({ 
  addresses, 
  onView, 
  onEdit, 
  onArchive, 
  onDelete, 
  deleting, 
  archiving 
}: CompanyAddressListProps) {
  if (addresses.length === 0) {
    return (
      <div className="rounded-sm border border-stroke bg-white px-5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No addresses found for this company.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                Address
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                City, State
              </th>
              <th className="min-w-[100px] px-4 py-4 font-medium text-black dark:text-white">
                Contact
              </th>
              <th className="min-w-[100px] px-4 py-4 font-medium text-black dark:text-white">
                Location
              </th>
              <th className="min-w-[80px] px-4 py-4 font-medium text-black dark:text-white">
                Status
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {addresses.map((address) => (
              <tr key={address.address_no} className="border-b border-stroke dark:border-strokedark">
                <td className="px-4 py-5">
                  <div className="flex flex-col">
                    <p className="font-medium text-black dark:text-white">
                      {address.line1}
                    </p>
                    {address.line2 && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {address.line2}
                      </p>
                    )}
                    {address.line3 && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {address.line3}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-4 py-5">
                  <p className="text-black dark:text-white">
                    {address.city}
                    {address.state && `, ${address.state}`}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {address.zip} {address.country}
                  </p>
                </td>
                <td className="px-4 py-5">
                  <div className="flex flex-col text-sm">
                    {address.phone1 && (
                      <p className="text-black dark:text-white">{address.phone1}</p>
                    )}
                    {address.email1 && (
                      <p className="text-primary">{address.email1}</p>
                    )}
                  </div>
                </td>
                <td className="px-4 py-5">
                  <p className="text-black dark:text-white">
                    {address.locaction || '-'}
                  </p>
                </td>
                <td className="px-4 py-5">
                  {address.relationship_archived ? (
                    <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-100">
                      Archived
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-100">
                      Active
                    </span>
                  )}
                </td>
                <td className="px-4 py-5">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onView(address)}
                      className="inline-flex items-center justify-center rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onEdit(address)}
                      className="inline-flex items-center justify-center rounded bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-opacity-90"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onArchive(address.address_no, address.relationship_archived || false)}
                      disabled={archiving === address.address_no}
                      className={`inline-flex items-center justify-center rounded px-3 py-1.5 text-xs font-medium text-white ${
                        address.relationship_archived
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-yellow-600 hover:bg-yellow-700'
                      } disabled:opacity-50`}
                    >
                      {archiving === address.address_no 
                        ? 'Processing...' 
                        : address.relationship_archived 
                          ? 'Restore' 
                          : 'Archive'
                      }
                    </button>
                    <button
                      onClick={() => onDelete(address.address_no)}
                      disabled={deleting === address.address_no}
                      className="inline-flex items-center justify-center rounded bg-danger px-3 py-1.5 text-xs font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
                    >
                      {deleting === address.address_no ? 'Removing...' : 'Remove'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
