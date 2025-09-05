"use client";

import { useEffect, useState } from "react";
import { PlayProduction } from "@/types/play";

interface ProductionFormProps {
  onSubmit: (form: Omit<PlayProduction, 'production_no'>) => Promise<void>;
  onCancel?: () => void;
  initialData?: PlayProduction | null;
}

export default function ProductionForm({ onSubmit, onCancel, initialData }: ProductionFormProps) {
  const [playNo, setPlayNo] = useState<number | "">("");
  const [companyNo, setCompanyNo] = useState<number | "">("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [season, setSeason] = useState("");
  const [festival, setFestival] = useState("");
  const [canceled, setCanceled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [seasonError, setSeasonError] = useState<string>("");
  const [festivalError, setFestivalError] = useState<string>("");
  const [plays, setPlays] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);

  const toInputDate = (dateString: string | null) => {
    if (!dateString) return "";
    const s = String(dateString);
    return s.length >= 10 ? s.slice(0, 10) : s;
  };

  useEffect(() => {
    if (initialData) {
      setPlayNo(initialData.play_no ?? "");
      setCompanyNo(initialData.company_no ?? "");
      setStartDate(toInputDate(initialData.start_date));
      setEndDate(toInputDate(initialData.end_date));
      setSeason(initialData.season ?? "");
      setFestival(initialData.festival ?? "");
      setCanceled(initialData.canceled ?? false);
    }
  }, [initialData]);

  useEffect(() => {
    const load = async () => {
      try {
        const [playsRes, companiesRes] = await Promise.all([
          fetch('/api/plays'),
          fetch('/api/companies')
        ]);
        if (playsRes.ok) setPlays(await playsRes.json());
        if (companiesRes.ok) setCompanies(await companiesRes.json());
      } catch (e) {
      }
    };
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playNo || !companyNo) return;
    if (endDate && startDate && endDate < startDate) return;
    if (season && season.length > 10) {
      setSeasonError("Max length is 10 characters");
      return;
    }
    if (festival && festival.length > 30) {
      setFestivalError("Max length is 30 characters");
      return;
    }
    setLoading(true);
    try {
      await onSubmit({
        play_no: typeof playNo === 'number' ? playNo : null,
        company_no: typeof companyNo === 'number' ? companyNo : null,
        start_date: startDate || null,
        end_date: endDate || null,
        season: season ? season.substring(0, 10) : null,
        festival: festival ? festival.substring(0, 30) : null,
        canceled,
        archived: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2.5 block text-black dark:text-white">Play Name</label>
          <select
            value={String(playNo)}
            onChange={(e)=> setPlayNo(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            required
          >
            <option value="">Select play</option>
            {plays.map((p:any) => (
              <option key={p.play_no} value={p.play_no}>{p.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2.5 block text-black dark:text-white">Company Name</label>
          <select
            value={String(companyNo)}
            onChange={(e)=> setCompanyNo(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            required
          >
            <option value="">Select company</option>
            {companies.map((c:any) => (
              <option key={c.company_no} value={c.company_no}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2.5 block text-black dark:text-white">Start Date</label>
          <input value={startDate} onChange={(e) => setStartDate(e.target.value)} type="date" className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" />
        </div>
        <div>
          <label className="mb-2.5 block text-black dark:text-white">End Date</label>
          <input value={endDate} onChange={(e) => setEndDate(e.target.value)} type="date" className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" />
        </div>
        <div>
          <label className="mb-2.5 block text-black dark:text-white">Season</label>
          <input 
            value={season} 
            onChange={(e) => {
              const raw = e.target.value.slice(0, 10);
              setSeason(raw);
              setSeasonError(raw.length >= 10 ? "Max length is 10 characters" : "");
            }} 
            maxLength={10}
            className={`w-full rounded border-[1.5px] bg-transparent py-3 px-5 text-black outline-none transition dark:border-form-strokedark dark:bg-form-input dark:text-white ${seasonError ? 'border-danger focus:border-danger dark:focus:border-danger' : 'border-stroke focus:border-primary active:border-primary dark:focus:border-primary'}`}
            placeholder="Enter season" 
          />
          <p className={`mt-1 text-xs ${seasonError ? 'text-danger' : 'text-gray-500'}`}>Max length: 10 characters</p>
        </div>
        <div>
          <label className="mb-2.5 block text-black dark:text-white">Festival</label>
          <input 
            value={festival} 
            onChange={(e) => {
              const raw = e.target.value.slice(0, 30);
              setFestival(raw);
              setFestivalError(raw.length >= 30 ? 'Max length is 30 characters' : '');
            }} 
            maxLength={30}
            className={`w-full rounded border-[1.5px] bg-transparent py-3 px-5 text-black outline-none transition dark:border-form-strokedark dark:bg-form-input dark:text-white ${festivalError ? 'border-danger focus:border-danger dark:focus:border-danger' : 'border-stroke focus:border-primary active:border-primary dark:focus:border-primary'}`}
            placeholder="Enter festival " 
          />
          <p className={`mt-1 text-xs ${festivalError ? 'text-danger' : 'text-gray-500'}`}>Max length: 30 characters</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={canceled} onChange={(e) => setCanceled(e.target.checked)} className="h-4 w-4 rounded border-stroke text-primary focus:ring-0 dark:border-strokedark" />
          <span className="text-black dark:text-white">Canceled</span>
        </label>
      </div>

      <div className="flex items-center justify-end gap-4 pt-2">
        <button 
          type="submit" 
          disabled={loading}
          className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50"
        >
          {loading ? 'Updating...' : (initialData ? 'Update' : 'Save')}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white hover:border-black hover:dark:border-white"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}


