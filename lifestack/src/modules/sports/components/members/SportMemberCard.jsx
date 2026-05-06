import React from "react";
import { Edit2, Trash2 } from "lucide-react";

import PersonAvatar from "../../../people/components/PersonAvatar.jsx";

export default function SportMemberCard({ member, person, onEdit, onRemove }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <PersonAvatar person={person} />
          <div className="min-w-0">
            <h3 className="truncate font-bold text-gray-900">{person?.name || "Unknown person"}</h3>
            <p className="truncate text-sm text-gray-500">{person?.email || person?.phone || "No contact info"}</p>
          </div>
        </div>

        <div className="flex gap-1">
          <button onClick={() => onEdit(member)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
            <Edit2 className="h-4 w-4" />
          </button>
          <button onClick={() => onRemove(member)} className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-gray-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Role</p>
          <p className="mt-1 font-semibold text-gray-900">{member.role || "Player"}</p>
        </div>
        <div className="rounded-xl bg-gray-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Position</p>
          <p className="mt-1 font-semibold text-gray-900">{member.position || "-"}</p>
        </div>
        <div className="rounded-xl bg-gray-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Jersey</p>
          <p className="mt-1 font-semibold text-gray-900">{member.jerseyNumber || "-"}</p>
        </div>
        <div className="rounded-xl bg-gray-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Share weight</p>
          <p className="mt-1 font-semibold text-gray-900">{member.shareWeight || 1}</p>
        </div>
      </div>
    </div>
  );
}
