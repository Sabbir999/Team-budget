import React, { useState } from "react";
import { X } from "lucide-react";

export default function SportMemberForm({ member, person, onSave, onClose }) {
  const [form, setForm] = useState({
    role: member?.role || "Player",
    position: member?.position || "",
    jerseyNumber: member?.jerseyNumber || "",
    shareWeight: member?.shareWeight || 1,
    isActive: member?.isActive ?? true,
  });

  const updateField = (name, value) => {
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({
      ...member,
      ...form,
      shareWeight: Number(form.shareWeight) || 1,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Edit member profile</h2>
            <p className="text-sm text-gray-500">{person?.name || "Team member"}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label>
            <span className="text-sm font-semibold text-gray-700">Role</span>
            <input value={form.role} onChange={(event) => updateField("role", event.target.value)} className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5" />
          </label>
          <label>
            <span className="text-sm font-semibold text-gray-700">Position</span>
            <input value={form.position} onChange={(event) => updateField("position", event.target.value)} className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5" placeholder="Optional" />
          </label>
          <label>
            <span className="text-sm font-semibold text-gray-700">Jersey number</span>
            <input value={form.jerseyNumber} onChange={(event) => updateField("jerseyNumber", event.target.value)} className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5" placeholder="Optional" />
          </label>
          <label>
            <span className="text-sm font-semibold text-gray-700">Share weight</span>
            <input type="number" min="0" step="0.5" value={form.shareWeight} onChange={(event) => updateField("shareWeight", event.target.value)} className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5" />
          </label>
        </div>

        <label className="mt-4 flex items-center gap-2 text-sm font-semibold text-gray-700">
          <input type="checkbox" checked={form.isActive} onChange={(event) => updateField("isActive", event.target.checked)} />
          Active member
        </label>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button type="button" onClick={onClose} className="rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
          <button type="submit" className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700">Save changes</button>
        </div>
      </form>
    </div>
  );
}
