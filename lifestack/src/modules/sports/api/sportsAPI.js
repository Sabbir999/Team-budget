import {
  ref,
  set,
  get,
  update,
  remove,
  push,
  onValue,
  off,
} from "firebase/database";

import { db } from "../../../firebase-config";
import { DB_PATHS } from "../../../services/paths";

const now = () => Date.now();

const TEAMS_KEY = DB_PATHS.TEAMS || "teams";
const TEAM_EXPENSES_KEY = DB_PATHS.TEAM_EXPENSES || "teamExpenses";

const getTeamsPath = (userId) => `${DB_PATHS.USERS}/${userId}/${TEAMS_KEY}`;
const getTeamPath = (userId, teamId) => `${getTeamsPath(userId)}/${teamId}`;
const getTeamExpensesPath = (userId, teamId) =>
  `${getTeamPath(userId, teamId)}/${TEAM_EXPENSES_KEY}`;
const getTeamExpensePath = (userId, teamId, expenseId) =>
  `${getTeamExpensesPath(userId, teamId)}/${expenseId}`;

const listenToPath = (path, callback, errorMessage) => {
  const pathRef = ref(db, path);

  const unsubscribe = onValue(
    pathRef,
    callback,
    (error) => console.error(errorMessage, error)
  );

  return () => off(pathRef, "value", unsubscribe);
};

const normalizeMembers = (members = []) =>
  members
    .filter((member) => member?.personId || member?.id)
    .map((member, index) => ({
      personId: member.personId || member.id,
      role: member.role || (index === 0 ? "Organizer" : "Player"),
      position: member.position || "",
      jerseyNumber: member.jerseyNumber || "",
      shareWeight: Number(member.shareWeight) || 1,
      paymentStatus: member.paymentStatus || "unpaid",
      paidAmount: Number(member.paidAmount) || 0,
      partialPayments: member.partialPayments || [],
      isActive: member.isActive ?? true,
      joinedAt: member.joinedAt || now(),
    }));

export const sportsAPI = {
  createTeam: async (userId, teamData) => {
    const teamId = push(ref(db, getTeamsPath(userId))).key;

    const teamWithId = {
      ...teamData,
      id: teamId,
      name: teamData.name?.trim() || "",
      location: teamData.location?.trim() || "",
      season: teamData.season?.trim() || "",
      currency: teamData.currency || "USD",
      schedule: teamData.schedule?.trim() || "",
      paymentMethod: teamData.paymentMethod || "zelle",
      paymentDetails: teamData.paymentDetails?.trim() || "",
      description: teamData.description || "",
      members: normalizeMembers(teamData.members || []),
      customCategories: teamData.customCategories || [],
      createdBy: userId,
      createdAt: now(),
      updatedAt: now(),
    };

    await set(ref(db, getTeamPath(userId, teamId)), teamWithId);

    return teamWithId;
  },

  getTeams: (userId, callback) =>
    listenToPath(getTeamsPath(userId), callback, "Teams listener error:"),

  getTeam: (userId, teamId) => get(ref(db, getTeamPath(userId, teamId))),

  updateTeam: async (userId, teamId, updates) => {
    const finalUpdates = {
      ...updates,
      updatedAt: now(),
    };

    if (updates.members) {
      finalUpdates.members = normalizeMembers(updates.members);
    }

    await update(ref(db, getTeamPath(userId, teamId)), finalUpdates);

    return teamId;
  },

  deleteTeam: async (userId, teamId) => {
    await remove(ref(db, getTeamPath(userId, teamId)));

    return teamId;
  },

  updateTeamMembers: async (userId, teamId, members) => {
    await update(ref(db, getTeamPath(userId, teamId)), {
      members: normalizeMembers(members),
      updatedAt: now(),
    });

    return teamId;
  },

  createTeamExpense: async (userId, teamId, expenseData) => {
    const expenseId = push(ref(db, getTeamExpensesPath(userId, teamId))).key;

    const expenseWithId = {
      ...expenseData,
      id: expenseId,
      amount: Number(expenseData.amount) || 0,
      splitBetween: expenseData.splitBetween || [],
      status: expenseData.status || "unpaid",
      createdAt: now(),
      updatedAt: now(),
    };

    await set(ref(db, getTeamExpensePath(userId, teamId, expenseId)), expenseWithId);

    return expenseWithId;
  },

  getTeamExpenses: (userId, teamId, callback) =>
    listenToPath(
      getTeamExpensesPath(userId, teamId),
      callback,
      "Team expenses listener error:"
    ),

  updateTeamExpense: async (userId, teamId, expenseId, updates) => {
    const finalUpdates = {
      ...updates,
      updatedAt: now(),
    };

    if (updates.amount !== undefined) {
      finalUpdates.amount = Number(updates.amount) || 0;
    }

    await update(ref(db, getTeamExpensePath(userId, teamId, expenseId)), finalUpdates);

    return expenseId;
  },

  deleteTeamExpense: async (userId, teamId, expenseId) => {
    await remove(ref(db, getTeamExpensePath(userId, teamId, expenseId)));

    return expenseId;
  },
};

export const teamsAPI = {
  createTeam: sportsAPI.createTeam,
  getTeams: sportsAPI.getTeams,
  getTeam: sportsAPI.getTeam,
  updateTeam: sportsAPI.updateTeam,
  updateTeamMembers: sportsAPI.updateTeamMembers,
  deleteTeam: sportsAPI.deleteTeam,
};

// Backward-compatible names for old imports while screens are migrated.
export const expensesAPI = {
  createExpense: (userId, expenseData) =>
    sportsAPI.createTeamExpense(userId, expenseData.teamId, expenseData),
  getExpenses: sportsAPI.getTeamExpenses,
  getExpense: () => Promise.resolve(null),
  updateExpense: (userId, expenseId, updates) =>
    sportsAPI.updateTeamExpense(userId, updates.teamId, expenseId, updates),
  deleteExpense: (userId, expenseId, teamId) =>
    sportsAPI.deleteTeamExpense(userId, teamId, expenseId),
};

export default sportsAPI;
