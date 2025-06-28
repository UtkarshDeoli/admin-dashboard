"use client";

import React, { useState, useEffect } from "react";
import { Person } from "@/types/company";
import PersonList from "./PersonList";
import PersonForm from "./PersonForm";

// Mock data
const mockPeople: Person[] = [
  {
    people_no: 1,
    first_name: "John",
    middle_name: "Michael",
    last_name: "Doe",
    address_no: 1,
    no_book: false,
    archived: false,
  },
  {
    people_no: 2,
    first_name: "Jane",
    middle_name: "",
    last_name: "Smith",
    address_no: 2,
    no_book: true,
    archived: false,
  },
  {
    people_no: 3,
    first_name: "Robert",
    middle_name: "James",
    last_name: "Johnson",
    address_no: 1,
    no_book: false,
    archived: false,
  },
];

export default function PeopleManager() {
  const [people, setPeople] = useState<Person[]>(mockPeople);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleCreate = () => {
    setEditingPerson(null);
    setShowForm(true);
  };

  const handleEdit = (person: Person) => {
    setEditingPerson(person);
    setShowForm(true);
  };

  const handleSave = (personData: Omit<Person, "people_no">) => {
    if (editingPerson) {
      // Update existing person
      setPeople(people.map(person => 
        person.people_no === editingPerson.people_no 
          ? { ...personData, people_no: editingPerson.people_no }
          : person
      ));
    } else {
      // Create new person
      const newPerson: Person = {
        ...personData,
        people_no: Math.max(...people.map(p => p.people_no)) + 1,
      };
      setPeople([...people, newPerson]);
    }
    setShowForm(false);
    setEditingPerson(null);
  };

  const handleDelete = (peopleNo: number) => {
    if (confirm("Are you sure you want to delete this person?")) {
      setPeople(people.filter(person => person.people_no !== peopleNo));
    }
  };

  const handleToggleArchive = (peopleNo: number) => {
    setPeople(people.map(person =>
      person.people_no === peopleNo
        ? { ...person, archived: !person.archived }
        : person
    ));
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPerson(null);
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
