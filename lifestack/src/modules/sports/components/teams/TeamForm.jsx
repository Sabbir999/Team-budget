import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

import { useAuth } from "../../../../contexts/AuthContext.jsx";
import { teamsAPI } from "../../api/sportsAPI.js";
import { peopleAPI } from "../../../people/api/peopleAPI.js";
import { snapshotToArray } from "../../../people/utils/peopleHelpers.js";
import PersonPicker from "../../../people/components/PersonPicker.jsx";

const currencies = ["USD", "CAD", "EUR", "GBP", "AUD"];

export default function TeamForm({ team, onClose }) {
  const { currentUser } = useAuth();
  const isEditing = Boolean(team);

  const [people, setPeople] = useState([]);
  const [selectedPersonIds, setSelectedPersonIds] = useState(
    team?.members?.map((member) => member.personId || member.id).filter(Boolean) || []
  );

  const [form, setForm] = useState({
    name: team?.name || "",
    location: team?.location || "",
    season: team?.season || "",
    currency: team?.currency || "USD",
    schedule: team?.schedule || "",
    paymentMethod: team?.paymentMethod || "zelle",
    paymentDetails: team?.paymentDetails || "",
    description: team?.description || "",
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

  const buildTeamMembers = () =>
    selectedPersonIds.map((personId, index) => {
      const existingMember = team?.members?.find(
        (member) => (member.personId || member.id) === personId
      );

      return {
        personId,
        role: existingMember?.role || (index === 0 ? "Captain" : "Player"),
        position: existingMember?.position || "",
        jerseyNumber: existingMember?.jerseyNumber || "",
        shareWeight: existingMember?.shareWeight || 1,
        isActive: existingMember?.isActive ?? true,
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
      setError("Team name is required.");
      return;
    }

    if (selectedPersonIds.length === 0) {
      setError("Add at least one person to the team.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const teamData = {
        ...form,
        members: buildTeamMembers(),
      };

      if (isEditing) {
        await teamsAPI.updateTeam(currentUser.uid, team.id, teamData);
      } else {
        await teamsAPI.createTeam(currentUser.uid, teamData);
      }

      onClose();
    } catch (submitError) {
      console.error(submitError);
      setError("Could not save team.");
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
              {isEditing ? "Edit team" : "Create team"}
            </h2>
            <p className="text-sm text-gray-500">
              Team members are selected from your global People list.
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
            <span className="text-sm font-semibold text-gray-700">Team name</span>
            <input
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5"
              placeholder="Michigan Bengals"
            />
          </label>

          <label>
            <span className="text-sm font-semibold text-gray-700">Location</span>
            <input
              value={form.location}
              onChange={(event) => updateField("location", event.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5"
              placeholder="Michigan"
            />
          </label>

          <label>
            <span className="text-sm font-semibold text-gray-700">Season</span>
            <input
              value={form.season}
              onChange={(event) => updateField("season", event.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5"
              placeholder="2026"
            />
          </label>

          <label>
            <span className="text-sm font-semibold text-gray-700">Currency</span>
            <select
              value={form.currency}
              onChange={(event) => updateField("currency", event.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5"
            >
              {currencies.map((currency) => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
          </label>

          <label>
            <span className="text-sm font-semibold text-gray-700">Schedule</span>
            <input
              value={form.schedule}
              onChange={(event) => updateField("schedule", event.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5"
              placeholder="Every Sunday"
            />
          </label>

          <label>
            <span className="text-sm font-semibold text-gray-700">Payment method</span>
            <input
              value={form.paymentMethod}
              onChange={(event) => updateField("paymentMethod", event.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5"
              placeholder="Zelle"
            />
          </label>

          <label>
            <span className="text-sm font-semibold text-gray-700">Payment details</span>
            <input
              value={form.paymentDetails}
              onChange={(event) => updateField("paymentDetails", event.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5"
              placeholder="email@example.com"
            />
          </label>

          <label className="md:col-span-2">
            <span className="text-sm font-semibold text-gray-700">Description</span>
            <textarea
              value={form.description}
              onChange={(event) => updateField("description", event.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5"
              rows={3}
              placeholder="Optional team notes"
            />
          </label>

          <div className="md:col-span-2">
            <PersonPicker
              people={people}
              selectedPersonIds={selectedPersonIds}
              onChange={setSelectedPersonIds}
              label="Team members"
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
            {saving ? "Saving..." : isEditing ? "Save changes" : "Create team"}
          </button>
        </div>
      </form>
    </div>
  );
}
