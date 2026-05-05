import React from "react";
import { Mail, Phone, CircleDollarSign } from "lucide-react";
import PersonAvatar from "./PersonAvatar";

export default function PersonCard({ person, onEdit, onOpen, onDelete }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="mb-4 flex items-center gap-3">
        <PersonAvatar person={person} size="lg" />

        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold text-gray-900">{person.name}</h3>
          <p className="text-sm text-gray-500">Saved person</p>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <p className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          <span className="truncate">{person.email || "No email"}</span>
        </p>
        <p className="flex items-center gap-2">
          <Phone className="h-4 w-4" />
          <span>{person.phone || "No phone"}</span>
        </p>
        <p className="flex items-center gap-2">
          <CircleDollarSign className="h-4 w-4" />
          <span className="truncate">{person.zelle || "No Zelle"}</span>
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onOpen?.(person)}
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
        >
          View
        </button>
        <button
          type="button"
          onClick={() => onEdit?.(person)}
          className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50"
        >
          Edit
        </button>
      </div>

      {onDelete && (
        <button
          type="button"
          onClick={() => onDelete(person)}
          className="mt-3 text-xs font-semibold text-red-500 hover:text-red-600"
        >
          Delete person
        </button>
      )}
    </div>
  );
}
