"use client";

import React, { useState, useEffect } from "react";
import { Person } from "@/types/company";
import { peopleAPI } from "@/lib/api";
import PersonList from "./PersonList";
import PersonForm from "./PersonForm";

export default function PeopleManager() {
  const [people, setPeople] = useState<Person[]>([]);
  const [editingPerson, setEditingPerson] = useState<Person | undefined>(undefined);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPeople();
  }, []);

  const loadPeople = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await peopleAPI.getAll();
      setPeople(data);
    } catch (err) {
      setError('Failed to load people');
      console.error('Error loading people:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingPerson(undefined);
    setShowForm(true);
  };

  const handleEdit = (person: Person) => {
    setEditingPerson(person);
    setShowForm(true);
  };

  const handleSave = async (personData: Omit<Person, "people_no">) => {
    try {
      if (editingPerson) {
        // Update existing person
        const updated = await peopleAPI.update(editingPerson.people_no, personData);
        setPeople(people.map(person => 
          person.people_no === editingPerson.people_no ? updated : person
        ));
      } else {
        // Create new person
        const newPerson = await peopleAPI.create(personData);
        setPeople([...people, newPerson]);
      }
      setShowForm(false);
      setEditingPerson(undefined);
    } catch (err) {
      console.error('Error saving person:', err);
      alert('Failed to save person');
    }
  };

  const handleDelete = async (peopleNo: number) => {
    if (confirm("Are you sure you want to delete this person?")) {
      try {
        await peopleAPI.delete(peopleNo);
        setPeople(people.filter(person => person.people_no !== peopleNo));
      } catch (err) {
        console.error('Error deleting person:', err);
        alert('Failed to delete person');
      }
    }
  };

  const handleToggleArchive = async (peopleNo: number) => {
    try {
      const person = people.find(p => p.people_no === peopleNo);
      if (person) {
        const updated = await peopleAPI.update(peopleNo, {
          ...person,
          archived: !person.archived
        });
        setPeople(people.map(p =>
          p.people_no === peopleNo ? updated : p
        ));
      }
    } catch (err) {
      console.error('Error toggling archive status:', err);
      alert('Failed to update person');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPerson(undefined);
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          People Management
        </h2>
        <button
          onClick={handleCreate}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90"
        >
          Add New Person
        </button>
      </div>

      {showForm ? (
        <PersonForm
          person={editingPerson}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <PersonList
          people={people}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleArchive={handleToggleArchive}
        />
      )}
    </div>
  );
}
