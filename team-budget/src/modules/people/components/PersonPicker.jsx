import React, { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import PersonAvatar from "./PersonAvatar";
import PersonForm from "./PersonForm";

export default function PersonPicker({
  people = [],
  selectedPersonIds = [],
  onChange,
  label = "People",
}) {
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const filteredPeople = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return people;
    }

    return people.filter((person) =>
      [person.name, person.email, person.phone]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term))
    );
  }, [people, search]);

  const togglePerson = (personId) => {
    const exists = selectedPersonIds.includes(personId);

    if (exists) {
      onChange(selectedPersonIds.filter((id) => id !== personId));
      return;
    }

    onChange([...selectedPersonIds, personId]);
  };

  const handlePersonSaved = (savedPerson) => {
    if (!savedPerson?.id) {
      return;
    }

    setSearch("");

    if (!selectedPersonIds.includes(savedPerson.id)) {
      onChange([...selectedPersonIds, savedPerson.id]);
    }
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-gray-700">{label}</span>

        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center rounded-lg border border-blue-200 px-3 py-1.5 text-sm font-semibold text-blue-600 hover:bg-blue-50"
        >
          <Plus className="mr-1 h-4 w-4" />
          New person
        </button>
      </div>

      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className="mb-3 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm"
        placeholder="Search people..."
      />

      <div className="max-h-60 space-y-2 overflow-y-auto rounded-xl border border-gray-200 p-2">
        {filteredPeople.map((person) => {
          const active = selectedPersonIds.includes(person.id);

          return (
            <button
              key={person.id}
              type="button"
              onClick={() => togglePerson(person.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition ${
                active
                  ? "bg-blue-50 ring-1 ring-blue-200"
                  : "hover:bg-gray-50"
              }`}
            >
              <PersonAvatar person={person} />

              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-gray-900">
                  {person.name}
                </p>
                <p className="truncate text-xs text-gray-500">
                  {person.email || person.phone || "No contact info"}
                </p>
              </div>

              <span
                className={`h-4 w-4 rounded border ${
                  active ? "border-blue-600 bg-blue-600" : "border-gray-300"
                }`}
              />
            </button>
          );
        })}

        {filteredPeople.length === 0 && (
          <p className="p-4 text-center text-sm text-gray-500">
            No people found. Add a new person.
          </p>
        )}
      </div>

      {showCreate && (
        <PersonForm
          onClose={() => setShowCreate(false)}
          onSaved={handlePersonSaved}
        />
      )}
    </div>
  );
}