"use client";

import { useState, useEffect } from "react";
import { Play, PlayContributor } from "@/types/play";

interface PlayFormProps {
  onSubmit: (formData: Omit<Play, 'play_no'>) => Promise<void>;
  onCancel?: () => void;
  initialData?: Play | null;
}

export default function PlayForm({ onSubmit, onCancel, initialData }: PlayFormProps) {
  const [title, setTitle] = useState("");
  const [playType, setPlayType] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [validPlayTypes, setValidPlayTypes] = useState<string[]>([]);
  const [contributors, setContributors] = useState<PlayContributor[]>([]);
  const [people, setPeople] = useState<any[]>([]);
  const [contributorTypes, setContributorTypes] = useState<string[]>([]);
  const [newContributor, setNewContributor] = useState({
    people_no: "",
    play_contributor_type: ""
  });
  useEffect(() => {
    const fetchPlayTypes = async () => {
      try {
        const response = await fetch('/api/play-types');
        if (response.ok) {
          const data = await response.json();
          setValidPlayTypes(data);
        } else {
          console.error('Failed to fetch play types');
          setValidPlayTypes(['Play', 'Musical', 'Opera', 'Short', '1-Act', 'Operetta', 'Youth']);
        }
      } catch (error) {
        console.error('Error fetching play types:', error);
        setValidPlayTypes(['Play', 'Musical', 'Opera', 'Short', '1-Act', 'Operetta', 'Youth']);
      }
    };

    const fetchPeople = async () => {
      try {
        const response = await fetch('/api/people');
        if (response.ok) {
          const data = await response.json();
          setPeople(data);
        }
      } catch (error) {
        console.error('Error fetching people:', error);
      }
    };

    const fetchContributorTypes = async () => {
      try {
        const response = await fetch('/api/contributor-types');
        if (response.ok) {
          const data = await response.json();
          setContributorTypes(data);
        } else {
          setContributorTypes(['Director', 'Actor', 'Writer', 'Producer', 'Designer', 'Composer']);
        }
      } catch (error) {
        console.error('Error fetching contributor types:', error);
        setContributorTypes(['Director', 'Actor', 'Writer', 'Producer', 'Designer', 'Composer']);
      }
    };

    fetchPlayTypes();
    fetchPeople();
    fetchContributorTypes();
  }, []);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      if (initialData.play_type) {
        if (Array.isArray(initialData.play_type)) {
          setPlayType(initialData.play_type);
        } else {
          const parsedTypes = (initialData.play_type as string)
            .replace(/[{}]/g, '')
            .split(',')
            .map((type: string) => type.trim())
            .filter((type: string) => type.length > 0);
          setPlayType(parsedTypes);
        }
      } else {
        setPlayType([]);
      }
      if (initialData.contributors) {
        setContributors(initialData.contributors);
      }
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (
        initialData?.play_no &&
        newContributor.people_no &&
        newContributor.play_contributor_type
      ) {
        await fetch('/api/play-contributors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            play_no: initialData.play_no,
            people_no: parseInt(newContributor.people_no),
            play_contributor_type: newContributor.play_contributor_type,
          }),
        });
        setNewContributor({ people_no: "", play_contributor_type: "" });
      }

      await onSubmit({
        title,
        play_type: playType,
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPlayType = () => {
    setPlayType([...playType, '']);
  };

  const removePlayType = (index: number) => {
    setPlayType(playType.filter((_, i) => i !== index));
  };

  const updatePlayType = (index: number, value: string) => {
    const newPlayTypes = [...playType];
    newPlayTypes[index] = value;
    setPlayType(newPlayTypes);
  };

  const removeContributor = async (pcNo: number) => {
    try {
      const response = await fetch(`/api/play-contributors/${pcNo}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setContributors(contributors.filter(c => c.pc_no !== pcNo));
      }
    } catch (error) {
      console.error('Error removing contributor:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5">
        <div>
          <label className="mb-3 block text-sm font-medium text-black dark:text-white">Title</label>
          <input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" 
            placeholder="Enter play title "
            required
          />
        </div>
        <div>
          <label className="mb-3 block text-sm font-medium text-black dark:text-white">Play Type</label>
          <div className="space-y-2">
            {playType.map((type, index) => (
              <div key={index} className="flex gap-2">
                <select 
                  value={type} 
                  onChange={(e) => updatePlayType(index, e.target.value)} 
                  className="flex-1 rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  required
                >
                  <option value="">Select Play Type</option>
                  {validPlayTypes.map((validType) => (
                    <option key={validType} value={validType}>
                      {validType}
                    </option>
                  ))}
                </select>
                <button 
                  type="button" 
                  onClick={() => removePlayType(index)}
                  className="px-2 py-1 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
            <button 
              type="button" 
              onClick={addPlayType}
              className="text-sm text-primary hover:text-primary-dark"
            >
              + Add Play Type
            </button>
          </div>
        </div>
      </div>

      {initialData && (
        <div className="border-t pt-5">
          <h3 className="mb-4 text-lg font-medium text-black dark:text-white">Manage Contributors</h3>

          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">Person</label>
              <select
                value={newContributor.people_no}
                onChange={(e) => setNewContributor({ ...newContributor, people_no: e.target.value })}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              >
                <option value="">Select Person</option>
                {people.map((person) => (
                  <option key={person.people_no} value={person.people_no}>
                    {person.people_no}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">Contributor Type</label>
              <select
                value={newContributor.play_contributor_type}
                onChange={(e) => setNewContributor({ ...newContributor, play_contributor_type: e.target.value })}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              >
                <option value="">Select Type</option>
                {contributorTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {contributors.length > 0 && (
            <div className="space-y-2">
              <h4 className="mb-3 block text-md font-medium text-black dark:text-white">Existing Contributors</h4>
              {contributors.map((contributor) => (
                <div key={contributor.pc_no} className="flex items-center gap-4 rounded border border-stroke bg-gray-2 p-3 dark:border-form-strokedark dark:bg-meta-4">
                  <div className="flex-1">
                    <span className="font-medium text-black dark:text-white">Person: <span className="font-normal text-black dark:text-white">{contributor.people_no}</span></span> <br />
                    <span className="font-medium text-black dark:text-white">Type: <span className="font-normal text-black dark:text-white">{contributor.play_contributor_type}</span></span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeContributor(contributor.pc_no)}
                    className="rounded bg-danger px-3 py-1 text-sm text-white hover:bg-danger-dark"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-end gap-4 pt-2">
        <button 
          type="submit" 
          disabled={loading}
          className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50"
        >
          {loading ? 'Updating...' : (initialData ? 'Update Play' : 'Save')}
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
