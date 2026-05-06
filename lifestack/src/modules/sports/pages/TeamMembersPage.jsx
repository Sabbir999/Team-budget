import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search, Users } from "lucide-react";

import { useAuth } from "../../../contexts/AuthContext.jsx";
import { useData } from "../../../contexts/DataContext";
import { teamsAPI } from "../api/sportsAPI.js";
import { peopleAPI } from "../../people/api/peopleAPI.js";
import PersonPicker from "../../people/components/PersonPicker.jsx";
import { getPeopleMap, snapshotToArray } from "../../people/utils/peopleHelpers.js";
import SportMemberCard from "../components/members/SportMemberCard.jsx";
import SportMemberForm from "../components/members/SportMemberForm.jsx";

export default function TeamMembersPage() {
  const { currentUser } = useAuth();
  const { currentTeam, setCurrentTeam, teams } = useData();
  const [people, setPeople] = useState([]);
  const [search, setSearch] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!currentUser?.uid) {
      return undefined;
    }

    const unsubscribe = peopleAPI.getPeople(currentUser.uid, (snapshot) => {
      setPeople(snapshotToArray(snapshot));
    });

    return () => unsubscribe();
  }, [currentUser?.uid]);

  const peopleMap = useMemo(() => getPeopleMap(people), [people]);
  const members = currentTeam?.members || [];
  const selectedPersonIds = members.map((member) => member.personId).filter(Boolean);

  const filteredMembers = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return members;
    }

    return members.filter((member) => {
      const person = peopleMap[member.personId];
      return [person?.name, person?.email, person?.phone, member.role, member.position, member.jerseyNumber]
        .filter(Boolean)
        .some((value) => value.toString().toLowerCase().includes(term));
    });
  }, [members, peopleMap, search]);

  const persistMembers = async (nextMembers) => {
    if (!currentUser?.uid || !currentTeam?.id) {
      return;
    }

    setSaving(true);

    try {
      await teamsAPI.updateTeamMembers(currentUser.uid, currentTeam.id, nextMembers);
      setCurrentTeam({ ...currentTeam, members: nextMembers });
    } catch (error) {
      console.error("Could not update team members:", error);
      alert("Could not update team members: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePickerChange = (personIds) => {
    const nextMembers = personIds.map((personId, index) => {
      const existingMember = members.find((member) => member.personId === personId);

      return existingMember || {
        personId,
        role: index === 0 ? "Captain" : "Player",
        position: "",
        jerseyNumber: "",
        shareWeight: 1,
        isActive: true,
        joinedAt: Date.now(),
      };
    });

    persistMembers(nextMembers);
  };

  const handleSaveMember = (updatedMember) => {
    const nextMembers = members.map((member) =>
      member.personId === updatedMember.personId ? updatedMember : member
    );

    setEditingMember(null);
    persistMembers(nextMembers);
  };

  const handleRemoveMember = (memberToRemove) => {
    const person = peopleMap[memberToRemove.personId];

    if (!window.confirm(`Remove ${person?.name || "this member"} from ${currentTeam.name}?`)) {
      return;
    }

    persistMembers(members.filter((member) => member.personId !== memberToRemove.personId));
  };

  if (!currentTeam && teams.length === 0) {
    return (
      <div className="py-12 text-center">
        <Users className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-semibold text-gray-900">No teams available</h3>
        <p className="mt-2 text-sm text-gray-500">Create a team first to manage members.</p>
      </div>
    );
  }

  if (!currentTeam) {
    return (
      <div className="py-12 text-center">
        <Users className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-semibold text-gray-900">No active team selected</h3>
        <p className="mt-2 text-sm text-gray-500">Select a team from the sports dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team members</h1>
          <p className="mt-2 text-gray-600">
            Manage people profiles for {currentTeam.name}. Sport-specific info stays here.
          </p>
        </div>

        <button
          onClick={() => setShowPicker((value) => !value)}
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          disabled={saving}
        >
          <Plus className="mr-2 h-5 w-5" />
          Manage people
        </button>
      </div>

      {showPicker && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <PersonPicker
            people={people}
            selectedPersonIds={selectedPersonIds}
            onChange={handlePickerChange}
            label="Team members"
          />
          {saving && <p className="mt-3 text-sm text-gray-500">Saving...</p>}
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Search members..."
          />
        </div>
        <p className="mt-4 text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{filteredMembers.length}</span> of <span className="font-semibold text-gray-900">{members.length}</span> members
        </p>
      </div>

      {filteredMembers.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center shadow-sm">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-xl font-bold text-gray-900">No members found</h3>
          <p className="mx-auto mt-2 max-w-md text-gray-600">
            Add people from your People module to build this team roster.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredMembers.map((member) => (
            <SportMemberCard
              key={member.personId}
              member={member}
              person={peopleMap[member.personId]}
              onEdit={setEditingMember}
              onRemove={handleRemoveMember}
            />
          ))}
        </div>
      )}

      {editingMember && (
        <SportMemberForm
          member={editingMember}
          person={peopleMap[editingMember.personId]}
          onSave={handleSaveMember}
          onClose={() => setEditingMember(null)}
        />
      )}
    </div>
  );
}
