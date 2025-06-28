"use client";

import React, { useState } from "react";
import { Person } from "@/types/company";

interface PersonListProps {
  people: Person[];
  onEdit: (person: Person) => void;
  onDelete: (peopleNo: number) => void;
  onToggleArchive: (peopleNo: number) => void;
}

export default function PersonList({ people, onEdit, onDelete, onToggleArchive }: PersonListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showArchived, setShowArchived] = useState(false);

  const filteredPeople = people.filter(person => {
    const matchesSearch = 
      person.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.middle_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesArchiveFilter = showArchived || !person.archived;
    
    return matchesSearch && matchesArchiveFilter;
  });

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            People ({filteredPeople.length})
          </h4>
        </div>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showArchived}
              onChange={(e) => setShowArchived(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-black dark:text-white">Show Archived</span>
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search people..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 pl-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            <span className="absolute left-3 top-2.5">
              <svg
                className="fill-current text-body dark:text-bodydark1"
                width="20"
                height="20"
                viewBox="0 0 20 20"
              >
                <path d="M18.125 17.2l-4.4-4.4c1.2-1.4 1.9-3.2 1.9-5.2 0-4.4-3.6-8-8-8s-8 3.6-8 8 3.6 8 8 8c2 0 3.8-0.7 5.2-1.9l4.4 4.4c0.2 0.2 0.5 0.3 0.8 0.3s0.6-0.1 0.8-0.3c0.4-0.4 0.4-1.2 0-1.6zM2.625 7.6c0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6-6-2.7-6-6z"/>
              </svg>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                Name
              </th>
              <th className="min-w-[100px] px-4 py-4 font-medium text-black dark:text-white">
                Address ID
              </th>
              <th className="min-w-[80px] px-4 py-4 font-medium text-black dark:text-white">
                No Book
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
            {filteredPeople.map((person) => (
              <tr key={person.people_no} className={person.archived ? "opacity-60" : ""}>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <div className="text-black dark:text-white">
                    {person.first_name} {person.middle_name && `${person.middle_name} `}{person.last_name}
                  </div>
                  <div className="text-sm text-gray-500">ID: {person.people_no}</div>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">{person.address_no}</p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                      person.no_book
                        ? "bg-warning bg-opacity-10 text-warning"
                        : "bg-success bg-opacity-10 text-success"
                    }`}
                  >
                    {person.no_book ? "No Book" : "In Book"}
                  </span>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                      person.archived
                        ? "bg-danger bg-opacity-10 text-danger"
                        : "bg-success bg-opacity-10 text-success"
                    }`}
                  >
                    {person.archived ? "Archived" : "Active"}
                  </span>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    <button
                      onClick={() => onEdit(person)}
                      className="hover:text-primary"
                      title="Edit"
                    >
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                      >
                        <path d="M16.8754 11.6719C16.5379 11.6719 16.2285 11.9531 16.2285 12.3187V14.8219C16.2285 15.075 16.0316 15.2719 15.7785 15.2719H2.22227C1.96914 15.2719 1.77227 15.075 1.77227 14.8219V12.3187C1.77227 11.9812 1.49102 11.6719 1.12539 11.6719C0.759766 11.6719 0.478516 11.9531 0.478516 12.3187V14.8219C0.478516 15.7781 1.23789 16.5375 2.19414 16.5375H15.7785C16.7348 16.5375 17.4941 15.7781 17.4941 14.8219V12.3187C17.5223 11.9531 17.2129 11.6719 16.8754 11.6719Z"/>
                        <path d="M8.55074 12.3469C8.66324 12.4594 8.83199 12.5156 9.00074 12.5156C9.16949 12.5156 9.31012 12.4594 9.45074 12.3469L13.4726 8.43752C13.7257 8.1844 13.7257 7.79065 13.5007 7.53752C13.2476 7.2844 12.8539 7.2844 12.6007 7.5094L9.64762 10.4063V2.1094C9.64762 1.7719 9.36637 1.46252 9.00074 1.46252C8.63512 1.46252 8.35387 1.74377 8.35387 2.1094V10.4063L5.40074 7.53752C5.14762 7.2844 4.75387 7.31252 4.50074 7.56565C4.24762 7.81877 4.27574 8.21252 4.52887 8.46565L8.55074 12.3469Z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => onToggleArchive(person.people_no)}
                      className="hover:text-warning"
                      title={person.archived ? "Unarchive" : "Archive"}
                    >
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                      >
                        <path d="M15.75 3.375H2.25C1.83579 3.375 1.5 3.71079 1.5 4.125V5.25C1.5 5.66421 1.83579 6 2.25 6H2.625V13.5C2.625 14.7426 3.63236 15.75 4.875 15.75H13.125C14.3676 15.75 15.375 14.7426 15.375 13.5V6H15.75C16.1642 6 16.5 5.66421 16.5 5.25V4.125C16.5 3.71079 16.1642 3.375 15.75 3.375ZM13.875 13.5C13.875 13.9142 13.5392 14.25 13.125 14.25H4.875C4.46079 14.25 4.125 13.9142 4.125 13.5V6H13.875V13.5ZM15 4.875V4.875H3V4.875H15Z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(person.people_no)}
                      className="hover:text-danger"
                      title="Delete"
                    >
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                      >
                        <path d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"/>
                        <path d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"/>
                        <path d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"/>
                        <path d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.97558 13.4157C7.0037 13.4157 7.0037 13.4157 7.03183 13.4157C7.36933 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredPeople.length === 0 && (
        <div className="py-10 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm ? "No people found matching your search." : "No people yet."}
          </p>
        </div>
      )}
    </div>
  );
}
