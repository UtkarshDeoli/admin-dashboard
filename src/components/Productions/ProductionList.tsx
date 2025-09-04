"use client";

import { useMemo, useState } from "react";
import ProductionSearchForm from "./ProductionSearchForm";

interface ProductionRow {
  production_no: number;
  play_no: number | null;
  company_no: number | null;
  start_date: string | null;
  end_date: string | null;
  season: string | null;
  festival: string | null;
  canceled: boolean;
  archived: boolean;
}

interface ProductionListProps {
  productions: ProductionRow[];
  onEdit: (production: ProductionRow) => void;
  onDelete: (productionNo: number) => void;
  onView: (production: ProductionRow) => void;
  onAdd: () => void;
  deleting: number[];
  showSearchForm: boolean;
  onToggleSearch: () => void;
}

export default function ProductionList({ productions, onEdit, onDelete, onView, onAdd, deleting, showSearchForm, onToggleSearch }: ProductionListProps) {
  const [playNoFilter, setPlayNoFilter] = useState<string>("");
  const [companyNoFilter, setCompanyNoFilter] = useState<string>("");
  const [seasonFilter, setSeasonFilter] = useState<string>("");
  const [festivalFilter, setFestivalFilter] = useState<string>("");
  const [canceledFilter, setCanceledFilter] = useState<string>("all");
  const [appliedPlayNo, setAppliedPlayNo] = useState<string>("");
  const [appliedCompanyNo, setAppliedCompanyNo] = useState<string>("");
  const [appliedSeason, setAppliedSeason] = useState<string>("");
  const [appliedFestival, setAppliedFestival] = useState<string>("");
  const [appliedCanceled, setAppliedCanceled] = useState<string>("all");

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const filtered = useMemo(() => {
    return productions.filter(p => {
      if (appliedPlayNo && String(p.play_no ?? '').indexOf(appliedPlayNo) === -1) return false;
      if (appliedCompanyNo && String(p.company_no ?? '').indexOf(appliedCompanyNo) === -1) return false;
      if (appliedSeason && !(p.season || '').toLowerCase().includes(appliedSeason.toLowerCase())) return false;
      if (appliedFestival && !(p.festival || '').toLowerCase().includes(appliedFestival.toLowerCase())) return false;
      if (appliedCanceled !== 'all') {
        let wantCanceled: boolean | null = null;
        if (appliedCanceled === 'canceled' || appliedCanceled === 'yes') wantCanceled = true; 
        else if (appliedCanceled === 'active' || appliedCanceled === 'no') wantCanceled = false; 
        if (wantCanceled !== null && p.canceled !== wantCanceled) return false;
      }
      return true;
    });
  }, [productions, appliedPlayNo, appliedCompanyNo, appliedSeason, appliedFestival, appliedCanceled]);

  const handleSearch = () => {
    setAppliedPlayNo(playNoFilter);
    setAppliedCompanyNo(companyNoFilter);
    setAppliedSeason(seasonFilter);
    setAppliedFestival(festivalFilter);
    setAppliedCanceled(canceledFilter);
  };

  const handleReset = () => {
    setPlayNoFilter("");
    setCompanyNoFilter("");
    setSeasonFilter("");
    setFestivalFilter("");
    setCanceledFilter("all");
    setAppliedPlayNo("");
    setAppliedCompanyNo("");
    setAppliedSeason("");
    setAppliedFestival("");
    setAppliedCanceled("all");
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h4 className="text-xl font-semibold text-black dark:text-white">Productions Management</h4>
        <div className="flex items-center gap-3">
          <button onClick={onToggleSearch} className={`rounded px-4 py-2 text-sm font-medium text-white ${showSearchForm ? 'bg-secondary' : 'bg-meta-3'} hover:bg-opacity-90`}>
            {showSearchForm ? 'Hide Search' : 'Show Search'}
          </button>
          <button onClick={onAdd} className="inline-flex items-center justify-center rounded bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90">
            Add Production
          </button>
        </div>
      </div>

      {showSearchForm && (
        <div className="mb-4">
          <ProductionSearchForm
            defaultFilters={{
              playNo: appliedPlayNo,
              companyNo: appliedCompanyNo,
              season: appliedSeason,
              festival: appliedFestival,
              canceled: appliedCanceled,
            }}
            onSearch={(f)=>{
              setPlayNoFilter(f.playNo);
              setCompanyNoFilter(f.companyNo);
              setSeasonFilter(f.season);
              setFestivalFilter(f.festival);
              setCanceledFilter(f.canceled);
              setAppliedPlayNo(f.playNo);
              setAppliedCompanyNo(f.companyNo);
              setAppliedSeason(f.season);
              setAppliedFestival(f.festival);
              setAppliedCanceled(f.canceled);
            }}
          />
        </div>
      )}

      <div className="w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="px-4 py-4 font-medium text-black dark:text-white">Production No</th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">Play No</th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">Company No</th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">Start</th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">End</th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">Season</th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">Festival</th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">Canceled</th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">Archived</th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-gray-400">No productions found</td>
              </tr>
            ) : null}
            {filtered.map((production) => {
              const isDeleting = deleting.includes(production.production_no);
              
              return (
                <tr key={production.production_no} className="border-b border-stroke dark:border-strokedark">
                  <td className="px-4 py-4">{production.production_no}</td>
                  <td className="px-4 py-4">{production.play_no ?? '-'}</td>
                  <td className="px-4 py-4">{production.company_no ?? '-'}</td>
                  <td className="px-4 py-4">{formatDate(production.start_date)}</td>
                  <td className="px-4 py-4">{formatDate(production.end_date)}</td>
                  <td className="px-4 py-4">{production.season ?? '-'}</td>
                  <td className="px-4 py-4">{production.festival ?? '-'}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${production.canceled ? 'bg-danger/10 text-danger border-danger/20' : 'bg-success/10 text-success border-success/20'}`}>
                      {production.canceled ? 'Canceled' : 'Active'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${production.archived ? 'bg-gray-500/10 text-gray-400 border-gray-500/20' : 'bg-meta-3/10 text-meta-3 border-meta-3/20'}`}>
                      {production.archived ? 'Archived' : 'Live'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-3.5">
                      <button
                        className="hover:text-primary"
                        onClick={() => onView(production)}
                        title="View"
                        disabled={isDeleting}
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                            fill=""
                          />
                          <path
                            d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                            fill=""
                          />
                        </svg>
                      </button>
                      <button
                        className="hover:text-primary"
                        onClick={() => onEdit(production)}
                        title="Edit"
                        disabled={isDeleting}
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M16.1 2.9C15.7 2.5 15.1 2.5 14.7 2.9L13.4 4.2L15.8 6.6L17.1 5.3C17.5 4.9 17.5 4.3 17.1 3.9L16.1 2.9Z"
                            fill=""
                          />
                          <path
                            d="M12.5 5.1L14.9 7.5L6.7 15.7H4.3V13.3L12.5 5.1Z"
                            fill=""
                          />
                          <path
                            d="M1.5 17.5H16.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                      <button
                        className={`hover:text-danger ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => !isDeleting && onDelete(production.production_no)}
                        title="Delete"
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-danger"></div>
                        ) : (
                          <svg
                            className="fill-current"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2969H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                              fill=""
                            />
                            <path
                              d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                              fill=""
                            />
                            <path
                              d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                              fill=""
                            />
                            <path
                              d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.34120 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                              fill=""
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      
    </div>
  );
}