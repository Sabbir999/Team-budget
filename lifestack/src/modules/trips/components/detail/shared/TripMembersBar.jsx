import React from "react";
import { UserPlus, X } from "lucide-react";
import PersonAvatar from "../../../../people/components/PersonAvatar";

export default function TripMembersBar({ trip, members, onEditTrip, onSelectMember, onRemoveMember }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-bold text-gray-900">Members ({members.length})</h3>
        <button type="button" onClick={() => onEditTrip?.(trip)} className="inline-flex items-center rounded-xl border border-dashed border-blue-300 px-3 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50">
          <UserPlus className="mr-1 h-4 w-4" />
          Manage people
        </button>
      </div>
      {members.some((member) => member.isLegacyMember) && (
        <div className="mb-4 rounded-xl bg-amber-50 p-3 text-sm font-medium text-amber-700">
          This trip has old member data. Click Manage people, select people from your People list, and save the trip.
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {members.map((member) => (
          <div key={member.personId || member.id} className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-2 py-1.5 text-sm font-semibold text-gray-700 hover:border-blue-300 hover:bg-blue-50">
            <button type="button" onClick={() => onSelectMember(member)} className="inline-flex items-center gap-2">
              <PersonAvatar person={member.globalProfile || member} />
              <span>{member.name}</span>
            </button>
            <button type="button" onClick={(event) => { event.stopPropagation(); onRemoveMember(member); }} className="rounded-full p-1 text-gray-400 hover:bg-red-100 hover:text-red-600" title="Remove from this trip">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
