import React, { useMemo, useState } from "react";
import { Plus, Search, Trophy, Users, MapPin } from "lucide-react";

import { useData } from "../../../contexts/DataContext";
import TeamCard from "../components/teams/TeamCard";
import TeamForm from "../components/teams/TeamForm";

export default function TeamsPage() {
  const { teams, currentTeam } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTeams = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return teams;
    }

    return teams.filter((team) =>
      [team.name, team.location, team.season]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term))
    );
  }, [teams, searchTerm]);

  const stats = useMemo(() => {
    const totalMembers = teams.reduce((sum, team) => sum + (team.members?.length || 0), 0);
    const teamsWithLocation = teams.filter((team) => team.location).length;

    return { totalTeams: teams.length, totalMembers, teamsWithLocation };
  }, [teams]);

  const handleEdit = (team) => {
    setEditingTeam(team);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setEditingTeam(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
          <p className="mt-2 max-w-2xl text-gray-600">
            Create teams, connect people from your global People module, and track team expenses.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          <Plus className="mr-2 h-5 w-5" />
          Create team
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600"><Trophy className="h-6 w-6" /></div>
            <div><p className="text-sm font-medium text-gray-600">Total teams</p><p className="text-2xl font-bold text-gray-900">{stats.totalTeams}</p></div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-green-50 p-3 text-green-600"><Users className="h-6 w-6" /></div>
            <div><p className="text-sm font-medium text-gray-600">Team members</p><p className="text-2xl font-bold text-gray-900">{stats.totalMembers}</p></div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-purple-50 p-3 text-purple-600"><MapPin className="h-6 w-6" /></div>
            <div><p className="text-sm font-medium text-gray-600">With locations</p><p className="text-2xl font-bold text-gray-900">{stats.teamsWithLocation}</p></div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Search teams by name, location, or season..."
          />
        </div>
        <p className="mt-4 text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{filteredTeams.length}</span> of <span className="font-semibold text-gray-900">{teams.length}</span> teams
        </p>
      </div>

      {filteredTeams.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center shadow-sm">
          <Trophy className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-xl font-bold text-gray-900">{teams.length === 0 ? "No teams yet" : "No teams found"}</h3>
          <p className="mx-auto mt-2 max-w-md text-gray-600">
            {teams.length === 0 ? "Create your first team and add people from your People module." : "Try a different search."}
          </p>
          <button onClick={() => setShowForm(true)} className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
            Create team
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {currentTeam && filteredTeams.some((team) => team.id === currentTeam.id) && (
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Active team</h3>
              <TeamCard team={currentTeam} onEdit={handleEdit} isActive />
            </div>
          )}

          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">All teams</h3>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {filteredTeams
                .filter((team) => !currentTeam || team.id !== currentTeam.id)
                .map((team) => (
                  <TeamCard key={team.id} team={team} onEdit={handleEdit} />
                ))}
            </div>
          </div>
        </div>
      )}

      {showForm && <TeamForm team={editingTeam} onClose={handleCloseForm} />}
    </div>
  );
}
