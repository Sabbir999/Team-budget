import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

import { useAuth } from "../../../contexts/AuthContext.jsx";
import { tripsAPI } from "../api/tripsAPI.js";
import { peopleAPI } from "../../people/api/peopleAPI.js";
import { snapshotToArray } from "../../people/utils/peopleHelpers.js";
import PersonPicker from "../../people/components/PersonPicker.jsx";

export default function TripForm({ trip, onClose }) {
  const { currentUser } = useAuth();
  const isEditing = Boolean(trip);

  const [people, setPeople] = useState([]);
  const [selectedPersonIds, setSelectedPersonIds] = useState(
    trip?.members?.map((member) => member.personId || member.id).filter(Boolean) || []
  );

  const [form, setForm] = useState({
    name: trip?.name || "",
    destination: trip?.destination || "",
    dateFrom: trip?.dateFrom || "",
    dateTo: trip?.dateTo || "",
    description: trip?.description || "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentUser?.uid) {
      return undefined;
    }

    const unsubscribe = peopleAPI.getPeople(currentUser.uid, (snapshot) => {
      setPeople(snapshotToArray(snapshot));
    });

    return () => unsubscribe();
  }, [currentUser?.uid]);

  const updateField = (name, value) => {
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const buildTripMembers = () =>
    selectedPersonIds.map((personId, index) => {
      const existingMember = trip?.members?.find(
        (member) => (member.personId || member.id) === personId
      );

      return {
        personId,
        role: existingMember?.role || (index === 0 ? "Organizer" : "Member"),
        paymentStatus: existingMember?.paymentStatus || "unpaid",
        partialPayments: existingMember?.partialPayments || [],
        joinedAt: existingMember?.joinedAt || Date.now(),
      };
    });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!currentUser?.uid) {
      setError("You must be logged in.");
      return;
    }

    if (!form.name.trim()) {
      setError("Trip name is required.");
      return;
    }

    if (selectedPersonIds.length === 0) {
      setError("Add at least one person to the trip.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const tripData = {
        ...form,
        members: buildTripMembers(),
        customCategories: trip?.customCategories || [],
      };

      if (isEditing) {
        await tripsAPI.updateTrip(currentUser.uid, trip.id, tripData);
      } else {
        await tripsAPI.createTrip(currentUser.uid, tripData);
      }

      onClose();
    } catch (submitError) {
      console.error(submitError);
      setError("Could not save trip.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form
        onSubmit={handleSubmit}
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isEditing ? "Edit trip" : "Create trip"}
            </h2>
            <p className="text-sm text-gray-500">
              Trip members are selected from your global People list.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <label className="md:col-span-2">
            <span className="text-sm font-semibold text-gray-700">Trip name</span>
            <input
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5"
              placeholder="Gatlinburg"
            />
          </label>

          <label className="md:col-span-2">
            <span className="text-sm font-semibold text-gray-700">Destination</span>
            <input
              value={form.destination}
              onChange={(event) => updateField("destination", event.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5"
              placeholder="Tennessee, USA"
            />
          </label>

          <label>
            <span className="text-sm font-semibold text-gray-700">Start date</span>
            <input
              type="date"
              value={form.dateFrom}
              onChange={(event) => updateField("dateFrom", event.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5"
            />
          </label>

          <label>
            <span className="text-sm font-semibold text-gray-700">End date</span>
            <input
              type="date"
              value={form.dateTo}
              onChange={(event) => updateField("dateTo", event.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5"
            />
          </label>

          <label className="md:col-span-2">
            <span className="text-sm font-semibold text-gray-700">Description</span>
            <textarea
              value={form.description}
              onChange={(event) => updateField("description", event.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5"
              rows={3}
              placeholder="Optional notes"
            />
          </label>

          <div className="md:col-span-2">
            <PersonPicker
              people={people}
              selectedPersonIds={selectedPersonIds}
              onChange={setSelectedPersonIds}
              label="Trip members"
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : isEditing ? "Save changes" : "Create trip"}
          </button>
        </div>
      </form>
    </div>
  );
}
