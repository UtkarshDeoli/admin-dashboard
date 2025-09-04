"use client";

import { useEffect, useState } from "react";
import { PlayContributor } from "@/types/play";

interface ContributorFormProps {
  onSubmit: (form: Omit<PlayContributor, 'pc_no'>) => Promise<void>;
  initialData?: PlayContributor | null;
}

export default function ContributorForm({ onSubmit, initialData }: ContributorFormProps) {
  const [playNo, setPlayNo] = useState<number | "">("");
  const [peopleNo, setPeopleNo] = useState<number | "">("");
  const [type, setType] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [playErr, setPlayErr] = useState("");
  const [peopleErr, setPeopleErr] = useState("");
  const [plays, setPlays] = useState<any[]>([]);
  const [people, setPeople] = useState<any[]>([]);
  const [types, setTypes] = useState<string[]>([]);

  useEffect(() => {
    if (initialData) {
      setPlayNo(initialData.play_no ?? "");
      setPeopleNo(initialData.people_no ?? "");
      setType(initialData.play_contributor_type ?? "");
    }
  }, [initialData]);

  useEffect(() => {
    const load = async () => {
      try {
        const [playsRes, peopleRes, typesRes] = await Promise.all([
          fetch('/api/plays'),
          fetch('/api/people'),
          fetch('/api/play-contributor-types')
        ]);
        if (playsRes.ok) setPlays(await playsRes.json());
        if (peopleRes.ok) setPeople(await peopleRes.json());
        if (typesRes.ok) setTypes(await typesRes.json());
      } catch (e) {
      }
    };
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPlayErr("");
    setPeopleErr("");
    if (!playNo || Number.isNaN(playNo)) {
      setPlayErr("Enter a valid Play No");
      return;
    }
    if (!peopleNo || Number.isNaN(peopleNo)) {
      setPeopleErr("Enter a valid People No");
      return;
    }
    if (!type) return;
    setLoading(true);
    try {
      await onSubmit({
        play_no: typeof playNo === 'number' ? playNo : null,
        people_no: typeof peopleNo === 'number' ? peopleNo : null,
        play_contributor_type: type,
      } as unknown as Omit<PlayContributor, 'pc_no'>);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2.5 block text-black dark:text-white">Play</label>
          <select
            value={String(playNo)}
            onChange={(e)=> setPlayNo(e.target.value === '' ? '' : Number(e.target.value))}
            className={`w-full rounded border-[1.5px] bg-transparent py-3 px-5 text-black outline-none transition dark:border-form-strokedark dark:bg-form-input dark:text-white ${playErr ? 'border-danger focus:border-danger dark:focus:border-danger' : 'border-stroke focus:border-primary active:border-primary dark:focus:border-primary'}`}
          >
            <option value="">Select play</option>
            {plays.map((p:any) => (
              <option key={p.play_no} value={p.play_no}>{p.title || `Play #${p.play_no}`}</option>
            ))}
          </select>
          {playErr && <p className="mt-1 text-xs text-danger">{playErr}</p>}
        </div>

        <div>
          <label className="mb-2.5 block text-black dark:text-white">Person</label>
          <select
            value={String(peopleNo)}
            onChange={(e)=> setPeopleNo(e.target.value === '' ? '' : Number(e.target.value))}
            className={`w-full rounded border-[1.5px] bg-transparent py-3 px-5 text-black outline-none transition dark:border-form-strokedark dark:bg-form-input dark:text-white ${peopleErr ? 'border-danger focus:border-danger dark:focus:border-danger' : 'border-stroke focus:border-primary active:border-primary dark:focus:border-primary'}`}
          >
            <option value="">Select person</option>
            {people.map((pr:any) => (
              <option key={pr.people_no} value={pr.people_no}>{pr.people_no}</option>
            ))}
          </select>
          {peopleErr && <p className="mt-1 text-xs text-danger">{peopleErr}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="mb-2.5 block text-black dark:text-white">Contributor Type</label>
          <select
            value={type}
            onChange={(e)=>setType(e.target.value)}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          >
            <option value="">Select type</option>
            {types.map((t)=> (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button type="submit" disabled={loading} className="rounded bg-primary px-4 py-2 text-sm text-white disabled:opacity-50">{loading ? 'Saving…' : 'Save'}</button>
      </div>
    </form>
  );
}

