import React, { useState } from "react";
import { X } from "lucide-react";

import { useAuth } from "../../../contexts/AuthContext";
import { peopleAPI } from "../api/peopleAPI";

const avatarColors = ["blue", "green", "purple", "amber", "pink", "gray"];

export default function PersonForm({ person = null, onClose }) {
  const { currentUser } = useAuth();
  const isEditing = Boolean(person);

  const [form, setForm] = useState({
    name: person?.name || "",
    email: person?.email || "",
    phone: person?.phone || "",
    zelle: person?.zelle || "",
    notes: person?.notes || "",
    avatarColor: person?.avatarColor || "blue",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const updateField = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!currentUser?.uid) {
      setError("You must be logged in.");
      return;
    }

    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      if (isEditing) {
        await peopleAPI.updatePerson(currentUser.uid, person.id, form);
      } else {
        await peopleAPI.createPerson(currentUser.uid, form);
      }

      onClose();
    } catch (submitError) {
      console.error(submitError);
      setError("Could not save person.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isEditing ? "Edit person" : "Add person"}
            </h2>
            <p className="text-sm text-gray-500">
              This profile can be reused in Trips, Sports, and future modules.
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
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

        <div className="grid gap-4">
          <label>
            <span className="text-sm font-semibold text-gray-700">Name</span>
            <input
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5"
              placeholder="Jordan Reed"
            />
          </label>

          <label>
            <span className="text-sm font-semibold text-gray-700">Email</span>
            <input
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5"
              placeholder="jordan@email.com"
            />
          </label>

          <label>
            <span className="text-sm font-semibold text-gray-700">Phone</span>
            <input
              value={form.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5"
              placeholder="+1 615 555 0192"
            />
          </label>

          <label>
            <span className="text-sm font-semibold text-gray-700">Zelle / payment handle</span>
            <input
              value={form.zelle}
              onChange={(event) => updateField("zelle", event.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5"
              placeholder="jordan@email.com"
            />
          </label>

          <label>
            <span className="text-sm font-semibold text-gray-700">Notes</span>
            <textarea
              value={form.notes}
              onChange={(event) => updateField("notes", event.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5"
              rows={3}
              placeholder="Optional notes..."
            />
          </label>

          <div>
            <span className="text-sm font-semibold text-gray-700">Avatar color</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {avatarColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => updateField("avatarColor", color)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-semibold capitalize ${
                    form.avatarColor === color
                      ? "border-blue-400 bg-blue-50 text-blue-700"
                      : "border-gray-300 text-gray-600"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
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
            {saving ? "Saving..." : isEditing ? "Save changes" : "Add person"}
          </button>
        </div>
      </form>
    </div>
  );
}
