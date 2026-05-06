import React, { useEffect, useMemo, useState } from "react";
import { Calendar, DollarSign, Plus, Trophy, Users } from "lucide-react";

import { useAuth } from "../../../contexts/AuthContext";
import { sportsAPI } from "../api/sportsAPI.js";

import TeamCard from "../components/teams/TeamCard.jsx";
import TeamForm from "../components/teams/TeamForm.jsx";
import TeamDetail from "../components/detail/TeamDetail.jsx";

const formatMoney = (amount, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(Number(amount) || 0);

export default function SportsDashboard() {
  const { currentUser } = useAuth();

  const [teams, setTeams] = useState([]);
  const [teamExpenseTotals, setTeamExpenseTotals] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [openTeam, setOpenTeam] = useState(null);
  const [deletingTeam, setDeletingTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.uid) {
      setTeams([]);
      setTeamExpenseTotals({});
      setLoading(false);
      return undefined;
    }

    setLoading(true);

    const expenseUnsubscribers = [];

    const unsubscribeTeams = sportsAPI.getTeams(currentUser.uid, (snapshot) => {
      const data = snapshot.val();

      const teamList = data
        ? Object.keys(data).map((key) => ({
            ...data[key],
            id: data[key].id || key,
          }))
        : [];

      teamList.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

      setTeams(teamList);
      setLoading(false);

      teamList.forEach((team) => {
        const unsubscribeExpenses = sportsAPI.getTeamExpenses(
          currentUser.uid,
          team.id,
          (expenseSnapshot) => {
            const expenseData = expenseSnapshot.val();

            const total = expenseData
              ? Object.values(expenseData).reduce(
                  (sum, expense) =>
                    sum + (Number(expense.total ?? expense.amount) || 0),
                  0
                )
              : 0;

            setTeamExpenseTotals((previous) => ({
              ...previous,
              [team.id]: total,
            }));
          }
        );

        expenseUnsubscribers.push(unsubscribeExpenses);
      });
    });

    return () => {
      unsubscribeTeams();
      expenseUnsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [currentUser?.uid]);

  const handleOpenTeam = (team) => {
    setOpenTeam(team);
  };

  const handleEditTeam = (team) => {
    setEditingTeam(team);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setEditingTeam(null);
    setShowForm(false);
  };

  const handleDeleteTeam = async () => {
    if (!currentUser?.uid || !deletingTeam) {
      return;
    }

    await sportsAPI.deleteTeam(currentUser.uid, deletingTeam.id);
    setDeletingTeam(null);

    if (openTeam?.id === deletingTeam.id) {
      setOpenTeam(null);
    }
  };

  const stats = useMemo(() => {
    const totalTeams = teams.length;

    const totalSpent = Object.values(teamExpenseTotals).reduce(
      (sum, value) => sum + value,
      0
    );

    const activeMembers = teams.reduce(
      (sum, team) => sum + (team.members?.length || 0),
      0
    );

    const activeSeasons = new Set(
      teams.map((team) => team.season).filter(Boolean)
    ).size;

    return {
      totalTeams,
      totalSpent,
      activeMembers,
      activeSeasons,
    };
  }, [teams, teamExpenseTotals]);

  if (openTeam) {
    const latestTeam = teams.find((team) => team.id === openTeam.id) || openTeam;

    return (
      <>
        <TeamDetail
          team={latestTeam}
          onBack={() => setOpenTeam(null)}
          onEditTeam={handleEditTeam}
        />

        {showForm && <TeamForm team={editingTeam} onClose={handleCloseForm} />}
      </>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sports</h1>
            <p className="mt-1 text-gray-600">All your teams in one place.</p>
          </div>

          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white shadow-sm hover:bg-blue-700"
          >
            <Plus className="mr-2 inline h-5 w-5" />
            New team
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total teams",
            value: stats.totalTeams,
            icon: Trophy,
          },
          {
            label: "Total spent",
            value: formatMoney(stats.totalSpent),
            icon: DollarSign,
          },
          {
            label: "Active seasons",
            value: stats.activeSeasons,
            icon: Calendar,
          },
          {
            label: "Members",
            value: stats.activeMembers,
            icon: Users,
          },
        ].map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <Icon className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {loading ? (
        <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center text-gray-500">
          Loading teams...
        </div>
      ) : teams.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
            <Trophy className="h-10 w-10 text-blue-500" />
          </div>

          <h3 className="text-2xl font-bold text-gray-900">No teams yet</h3>

          <p className="mx-auto mt-2 max-w-md text-gray-600">
            Create your first team to start tracking shared expenses and payments.
          </p>

          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
          >
            <Plus className="mr-2 inline h-5 w-5" />
            Create your first team
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              totalExpenses={teamExpenseTotals[team.id] || 0}
              memberCount={(team.members || []).length}
              onOpen={handleOpenTeam}
              onEdit={handleEditTeam}
              onDelete={setDeletingTeam}
              onShare={() => alert("Team sharing will be added later.")}
            />
          ))}
        </div>
      )}

      {showForm && <TeamForm team={editingTeam} onClose={handleCloseForm} />}

      {deletingTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-gray-900">Delete team?</h2>

            <p className="mt-2 text-sm text-gray-600">
              <span className="font-semibold">{deletingTeam.name}</span> and all related team data will be removed.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeletingTeam(null)}
                className="rounded-xl border border-gray-300 px-4 py-2.5 font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteTeam}
                className="rounded-xl bg-red-600 px-4 py-2.5 font-semibold text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
