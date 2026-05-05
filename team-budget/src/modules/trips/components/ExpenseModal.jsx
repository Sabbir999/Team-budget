import React, { useMemo, useState } from "react";
import { X, Trash2 } from "lucide-react";

import { useAuth } from "../../../contexts/AuthContext.jsx";
import { tripsAPI } from "../api/tripsAPI.js";
import { getTripCategories, getCategoryColor } from "../utils/tripCategories.js";
import PersonAvatar from "../../people/components/PersonAvatar.jsx";

const formatMoney = (amount) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    Number(amount) || 0
  );

export default function ExpenseModal({
  trip,
  members = [],
  expense = null,
  onClose,
  onManageCategories,
}) {
  const { currentUser } = useAuth();
  const isEditing = Boolean(expense);
  const categories = getTripCategories(trip);

  const [form, setForm] = useState({
    description: expense?.description || "",
    amount: expense?.amount || "",
    date: expense?.date || new Date().toISOString().slice(0, 10),
    category: expense?.category || categories[0]?.key || "other",
    paidBy: expense?.paidBy || members[0]?.personId || "",
    splitType: expense?.splitType || "equal",
    splitBetween: expense?.splitBetween || members.map((member) => member.personId),
    receiptNote: expense?.receiptNote || "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const eachPersonPays = useMemo(() => {
    const amount = Number(form.amount) || 0;
    const count = form.splitBetween.length;

    return count > 0 ? amount / count : 0;
  }, [form.amount, form.splitBetween]);

  const updateField = (name, value) => {
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const toggleSplitMember = (personId) => {
    setForm((previous) => {
      const exists = previous.splitBetween.includes(personId);

      return {
        ...previous,
        splitBetween: exists
          ? previous.splitBetween.filter((id) => id !== personId)
          : [...previous.splitBetween, personId],
      };
    });
  };

  const setAllMembers = () => {
    updateField(
      "splitBetween",
      members.map((member) => member.personId)
    );
  };

  const clearMembers = () => {
    updateField("splitBetween", []);
  };

  const validateForm = () => {
    if (!form.description.trim()) {
      return "Description is required.";
    }

    if ((Number(form.amount) || 0) <= 0) {
      return "Amount must be greater than 0.";
    }

    if (!form.paidBy) {
      return "Please select who paid.";
    }

    if (!form.splitBetween || form.splitBetween.length === 0) {
      return "Select at least one person to split this expense.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!currentUser?.uid) {
      return;
    }

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError("");

    try {
      if (isEditing) {
        await tripsAPI.updateTripExpense(currentUser.uid, trip.id, expense.id, form);
      } else {
        await tripsAPI.createTripExpense(currentUser.uid, trip.id, form);
      }

      onClose();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!currentUser?.uid || !expense?.id) {
      return;
    }

    await tripsAPI.deleteTripExpense(currentUser.uid, trip.id, expense.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <form
        onSubmit={handleSubmit}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditing ? "Edit expense" : "Add expense"}
          </h2>

          <div className="flex items-center gap-2">
            {isEditing && (
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                <Trash2 className="mr-1 inline h-4 w-4" />
                Delete
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <label className="md:col-span-2">
            <span className="text-sm font-semibold text-gray-700">Description</span>
            <input
              value={form.description}
              onChange={(event) => updateField("description", event.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5"
              placeholder="e.g. Airbnb cabin, dinner at..."
              required
            />
          </label>

          <label>
            <span className="text-sm font-semibold text-gray-700">Amount ($)</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={(event) => updateField("amount", event.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5"
              placeholder="0.00"
              required
            />
          </label>

          <label>
            <span className="text-sm font-semibold text-gray-700">Date</span>
            <input
              type="date"
              value={form.date}
              onChange={(event) => updateField("date", event.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5"
              required
            />
          </label>

          <div className="md:col-span-2">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">Category</span>
              <button
                type="button"
                onClick={onManageCategories}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                + Add custom
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const color = getCategoryColor(category);
                const active = form.category === category.key;

                return (
                  <button
                    key={category.id || category.key}
                    type="button"
                    onClick={() => updateField("category", category.key)}
                    className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
                      active ? color.badge : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>

          <label>
            <span className="text-sm font-semibold text-gray-700">Paid by</span>
            <select
              value={form.paidBy}
              onChange={(event) => updateField("paidBy", event.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5"
            >
              <option value="">Select payer</option>
              {members.map((member) => (
                <option key={member.personId} value={member.personId}>
                  {member.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="text-sm font-semibold text-gray-700">Split type</span>
            <select
              value={form.splitType}
              onChange={(event) => updateField("splitType", event.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5"
            >
              <option value="equal">Equal split</option>
            </select>
          </label>

          <div className="md:col-span-2">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">Split between</span>
              <div className="flex gap-2 text-sm font-semibold text-blue-600">
                <button type="button" onClick={setAllMembers}>All</button>
                <span>/</span>
                <button type="button" onClick={clearMembers}>None</button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {members.map((member) => {
                const active = form.splitBetween.includes(member.personId);

                return (
                  <button
                    key={member.personId}
                    type="button"
                    onClick={() => toggleSplitMember(member.personId)}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold ${
                      active
                        ? "border-blue-300 bg-blue-100 text-blue-700"
                        : "border-gray-300 bg-white text-gray-600"
                    }`}
                  >
                    <PersonAvatar person={member.globalProfile || member} />
                    {member.name}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="md:col-span-2">
            <span className="text-sm font-semibold text-gray-700">Receipt note</span>
            <input
              value={form.receiptNote}
              onChange={(event) => updateField("receiptNote", event.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5"
              placeholder="Optional note..."
            />
          </label>
        </div>

        <div className="mt-5 rounded-xl bg-gray-50 px-4 py-3 font-semibold text-gray-800">
          Each person pays{" "}
          <span className="float-right">{formatMoney(eachPersonPays)}</span>
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
            {saving ? "Saving..." : isEditing ? "Save changes" : "Add expense"}
          </button>
        </div>
      </form>
    </div>
  );
}
