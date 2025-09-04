"use client";

import { useState, useEffect } from "react";
import { Play } from "@/types/play";

interface PlayFormProps {
  onSubmit: (formData: Omit<Play, 'play_no'>) => Promise<void>;
  initialData?: Play | null;
}

export default function PlayForm({ onSubmit, initialData }: PlayFormProps) {
  const [title, setTitle] = useState("");
  const [playType, setPlayType] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [validPlayTypes, setValidPlayTypes] = useState<string[]>([]);
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

    fetchPlayTypes();
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
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
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

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2.5 block text-black dark:text-white">Title</label>
          <input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" 
            placeholder="Enter play title "
            required
          />
        </div>
        <div>
          <label className="mb-2.5 block text-black dark:text-white">Play Type</label>
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

      <div className="flex items-center justify-end gap-3 pt-2">
        <button 
          type="submit" 
          disabled={loading}
          className="rounded bg-primary px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}
