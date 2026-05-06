import React, { useState } from "react";
import { X } from "lucide-react";

import { useAuth } from "../../../contexts/AuthContext.jsx";
import { tripsAPI } from "../api/tripsAPI.js";
import { DEFAULT_TRIP_CATEGORIES, getCategoryColor } from "../utils/tripCategories.js";

export default function CategoryManagerModal({ trip, onClose }) {
  const { currentUser } = useAuth();
  const [newCategory, setNewCategory] = useState("");
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!newCategory.trim() || !currentUser?.uid) return;

    setSaving(true);

    try {
      const existing = trip.customCategories || [];
      const name = newCategory.trim();

      const category = {
        id: `custom_${Date.now()}`,
        name,
        key: name.toLowerCase().replace(/\s+/g, "_"),
        color: "blue",
        custom: true,
      };

      await tripsAPI.updateTrip(currentUser.uid, trip.id, {
        customCategories: [...existing, category],
      });
      setNewCategory("");
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (categoryId) => {
    if (!currentUser?.uid) return;

    await tripsAPI.updateTrip(currentUser.uid, trip.id, {
      customCategories: (trip.customCategories || []).filter(
        (category) => category.id !== categoryId
      ),
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Manage categories</h2>
            <p className="text-sm text-gray-500">
              Custom to this trip. Default categories stay locked.
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

        <h3 className="mb-2 text-sm font-bold text-gray-700">Default categories</h3>
        <div className="mb-5 flex flex-wrap gap-2">
          {DEFAULT_TRIP_CATEGORIES.map((category) => {
            const color = getCategoryColor(category);

            return (
              <span
                key={category.id}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold ${color.badge}`}
              >
                {category.name}
              </span>
            );
          })}
        </div>

        <h3 className="mb-2 text-sm font-bold text-gray-700">
          Your custom categories
        </h3>

        <div className="mb-5 divide-y divide-gray-200 rounded-xl border border-gray-200">
          {(trip.customCategories || []).length === 0 ? (
            <p className="p-4 text-sm text-gray-500">No custom categories yet.</p>
          ) : (
            trip.customCategories.map((category) => {
              const color = getCategoryColor(category);

              return (
                <div
                  key={category.id}
                  className="flex items-center justify-between gap-3 p-3"
                >
                  <span
                    className={`rounded-full px-3 py-1.5 text-sm font-semibold ${color.badge}`}
                  >
                    {category.name}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleRemove(category.id)}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div className="flex gap-2">
          <input
            value={newCategory}
            onChange={(event) => setNewCategory(event.target.value)}
            className="min-w-0 flex-1 rounded-xl border border-gray-300 px-4 py-2.5"
            placeholder="New category name..."
          />

          <button
            type="button"
            onClick={handleAdd}
            disabled={saving}
            className="rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
