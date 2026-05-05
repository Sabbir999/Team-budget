import React from "react";
import { Mail, Phone, CircleDollarSign, StickyNote } from "lucide-react";
import PersonAvatar from "./PersonAvatar";

export default function PersonProfile({ person, onBack, onEdit }) {
  if (!person) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mb-5 text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          ← Back
        </button>
      )}

      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <PersonAvatar person={person} size="lg" />

          <div>
            <h1 className="text-2xl font-bold text-gray-900">{person.name}</h1>
            <p className="text-sm text-gray-500">Global person profile</p>
          </div>
        </div>

        {onEdit && (
          <button
            type="button"
            onClick={() => onEdit(person)}
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50"
          >
            Edit profile
          </button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-gray-50 p-4">
          <p className="mb-2 text-sm font-bold text-gray-700">Contact info</p>

          <div className="space-y-3 text-sm text-gray-600">
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {person.email || "No email"}
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              {person.phone || "No phone"}
            </p>
            <p className="flex items-center gap-2">
              <CircleDollarSign className="h-4 w-4" />
              {person.zelle || "No Zelle"}
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-gray-50 p-4">
          <p className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700">
            <StickyNote className="h-4 w-4" />
            Notes
          </p>
          <p className="text-sm text-gray-600">{person.notes || "No notes yet."}</p>
        </div>
      </div>
    </div>
  );
}
