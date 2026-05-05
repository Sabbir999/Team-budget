import React, { useEffect, useMemo, useState } from "react";
import { Plus, Users } from "lucide-react";

import { useAuth } from "../../../contexts/AuthContext";
import { peopleAPI } from "../api/peopleAPI";
import { snapshotToArray } from "../utils/peopleHelpers";

import PersonCard from "../components/PersonCard";
import PersonForm from "../components/PersonForm";
import PersonProfile from "../components/PersonProfile";

export default function PeoplePage() {
  const { currentUser } = useAuth();

  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);
  const [openPerson, setOpenPerson] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!currentUser?.uid) {
      setPeople([]);
      setLoading(false);
      return undefined;
    }

    setLoading(true);

    const unsubscribe = peopleAPI.getPeople(currentUser.uid, (snapshot) => {
      const list = snapshotToArray(snapshot).sort((a, b) =>
        (a.name || "").localeCompare(b.name || "")
      );

      setPeople(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser?.uid]);

  const filteredPeople = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return people;
    }

    return people.filter((person) =>
      [person.name, person.email, person.phone, person.zelle]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term))
    );
  }, [people, search]);

  const handleEdit = (person) => {
    setEditingPerson(person);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setEditingPerson(null);
    setShowForm(false);
  };

  if (openPerson) {
    const latestPerson = people.find((person) => person.id === openPerson.id) || openPerson;

    return (
      <>
        <PersonProfile
          person={latestPerson}
          onBack={() => setOpenPerson(null)}
          onEdit={handleEdit}
        />

        {showForm && (
          <PersonForm person={editingPerson} onClose={handleCloseForm} />
        )}
      </>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">People</h1>
            <p className="mt-1 text-gray-600">
              Reusable profiles for trips, sports, and future modules.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700"
          >
            <Plus className="mr-2 inline h-5 w-5" />
            Add person
          </button>
        </div>
      </div>

      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-3"
        placeholder="Search people..."
      />

      {loading ? (
        <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center text-gray-500">
          Loading people...
        </div>
      ) : filteredPeople.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
            <Users className="h-10 w-10 text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">No people yet</h3>
          <p className="mx-auto mt-2 max-w-md text-gray-600">
            Add people once and reuse them across trips and future modules.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredPeople.map((person) => (
            <PersonCard
              key={person.id}
              person={person}
              onOpen={setOpenPerson}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      {showForm && (
        <PersonForm person={editingPerson} onClose={handleCloseForm} />
      )}
    </div>
  );
}
