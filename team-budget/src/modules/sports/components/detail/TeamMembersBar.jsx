import React from "react";
import { UserPlus, X } from "lucide-react";
import PersonAvatar from "../../../people/components/PersonAvatar.jsx";
import { getInitials } from "../../../people/utils/peopleHelpers.js";

export default function TeamMembersBar({ members = [], onEditTeam, onSelectMember, onRemoveMember }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-bold text-gray-900">Members ({members.length})</h2>

        <button
          type="button"
          onClick={onEditTeam}
          className="rounded-xl border border-dashed border-blue-300 px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50"
        >
          <UserPlus className="mr-1 inline h-4 w-4" />
          Manage people
        </button>
      </div>

      {members.length === 0 ? (
        <p className="text-sm text-gray-500">No members added yet.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {members.map((member) => {
            const name = member.person?.name || "Unknown member";

            return (
              <button
                key={member.personId}
                type="button"
                onClick={() => onSelectMember(member)}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-blue-50 hover:text-blue-700"
              >
                <PersonAvatar
                  person={member.person || { name }}
                  initials={getInitials(name)}
                  size="sm"
                />
                <span>{name}</span>

                {onRemoveMember && (
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(event) => {
                      event.stopPropagation();
                      onRemoveMember(member);
                    }}
                    className="rounded-full p-0.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                    title="Remove member"
                  >
                    <X className="h-4 w-4" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
