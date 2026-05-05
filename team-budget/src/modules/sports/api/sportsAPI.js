import {
  ref,
  set,
  get,
  update,
  remove,
  push,
  onValue,
  off,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";

import { db } from "../../../firebase-config";
import { DB_PATHS } from "../../../services/paths";
import { getTotalCalculationFields } from "./sportsConfig";

const now = () => Date.now();

const getUserCollectionPath = (userId, collectionName) =>
  `${DB_PATHS.USERS}/${userId}/${collectionName}`;

const getUserItemPath = (userId, collectionName, itemId) =>
  `${getUserCollectionPath(userId, collectionName)}/${itemId}`;

const createId = (userId, collectionName) =>
  push(ref(db, getUserCollectionPath(userId, collectionName))).key;

const listenToPath = (path, callback, onError) => {
  const pathRef = ref(db, path);

  const unsubscribe = onValue(
    pathRef,
    (snapshot) => callback(snapshot),
    (error) => {
      if (onError) {
        onError(error);
        return;
      }

      console.error("Firebase listener error:", error);
    }
  );

  return () => off(pathRef, "value", unsubscribe);
};

const listenToQuery = (firebaseQuery, callback, onError) => {
  const unsubscribe = onValue(
    firebaseQuery,
    (snapshot) => callback(snapshot),
    (error) => {
      if (onError) {
        onError(error);
        return;
      }

      console.error("Firebase query listener error:", error);
    }
  );

  return () => off(firebaseQuery, "value", unsubscribe);
};

const calculateExpenseTotals = (expenseData) => {
  const totalFields = getTotalCalculationFields(expenseData.sport);

  const total = totalFields.reduce(
    (sum, fieldName) => sum + (parseFloat(expenseData[fieldName]) || 0),
    0
  );

  const playersCount = expenseData.playersCount || 0;
  const perPerson = playersCount > 0 ? total / playersCount : 0;

  return {
    total,
    playersCount,
    perPerson: Math.round(perPerson * 100) / 100,
  };
};

export const sportsAPI = {
  teams: {
    create: async (userId, teamData) => {
      const teamId = createId(userId, DB_PATHS.TEAMS);

      const teamWithId = {
        ...teamData,
        id: teamId,
        createdBy: userId,
        createdAt: now(),
        updatedAt: now(),
      };

      await set(
        ref(db, getUserItemPath(userId, DB_PATHS.TEAMS, teamId)),
        teamWithId
      );

      return teamWithId;
    },

    getAll: (userId, callback) =>
      listenToPath(getUserCollectionPath(userId, DB_PATHS.TEAMS), callback),

    getById: (userId, teamId) =>
      get(ref(db, getUserItemPath(userId, DB_PATHS.TEAMS, teamId))),

    update: async (userId, teamId, updates) => {
      await update(ref(db, getUserItemPath(userId, DB_PATHS.TEAMS, teamId)), {
        ...updates,
        updatedAt: now(),
      });

      return teamId;
    },

    delete: async (userId, teamId) => {
      await remove(ref(db, getUserItemPath(userId, DB_PATHS.TEAMS, teamId)));

      return teamId;
    },

    getBySport: (userId, sportType) => {
      const teamsRef = ref(db, getUserCollectionPath(userId, DB_PATHS.TEAMS));

      const sportQuery = query(
        teamsRef,
        orderByChild("sportType"),
        equalTo(sportType)
      );

      return get(sportQuery);
    },
  },

  players: {
    create: async (userId, playerData) => {
      const playerId = createId(userId, DB_PATHS.PLAYERS);

      const playerWithId = {
        ...playerData,
        id: playerId,
        isActive:
          playerData.isActive !== undefined ? playerData.isActive : true,
        createdAt: now(),
        updatedAt: now(),
      };

      await set(
        ref(db, getUserItemPath(userId, DB_PATHS.PLAYERS, playerId)),
        playerWithId
      );

      return playerWithId;
    },

    getAll: (userId, callback) =>
      listenToPath(getUserCollectionPath(userId, DB_PATHS.PLAYERS), callback),

    getById: (userId, playerId) =>
      get(ref(db, getUserItemPath(userId, DB_PATHS.PLAYERS, playerId))),

    update: async (userId, playerId, updates) => {
      await update(
        ref(db, getUserItemPath(userId, DB_PATHS.PLAYERS, playerId)),
        {
          ...updates,
          updatedAt: now(),
        }
      );

      return playerId;
    },

    delete: async (userId, playerId) => {
      await remove(
        ref(db, getUserItemPath(userId, DB_PATHS.PLAYERS, playerId))
      );

      return playerId;
    },

    getByTeam: (userId, teamId, callback) => {
      const playersRef = ref(
        db,
        getUserCollectionPath(userId, DB_PATHS.PLAYERS)
      );

      const teamQuery = query(
        playersRef,
        orderByChild("teamId"),
        equalTo(teamId)
      );

      return listenToQuery(teamQuery, callback);
    },

    getActive: (userId, callback) => {
      const playersRef = ref(
        db,
        getUserCollectionPath(userId, DB_PATHS.PLAYERS)
      );

      const activeQuery = query(
        playersRef,
        orderByChild("isActive"),
        equalTo(true)
      );

      return listenToQuery(activeQuery, callback);
    },
  },

  expenses: {
    create: async (userId, expenseData) => {
      const expenseId = createId(userId, DB_PATHS.EXPENSES);
      const totals = calculateExpenseTotals(expenseData);

      const expenseWithId = {
        ...expenseData,
        id: expenseId,
        ...totals,
        createdAt: now(),
        updatedAt: now(),
      };

      await set(
        ref(db, getUserItemPath(userId, DB_PATHS.EXPENSES, expenseId)),
        expenseWithId
      );

      return expenseWithId;
    },

    getAll: (userId, callback) =>
      listenToPath(getUserCollectionPath(userId, DB_PATHS.EXPENSES), callback),

    getById: (userId, expenseId) =>
      get(ref(db, getUserItemPath(userId, DB_PATHS.EXPENSES, expenseId))),

    update: async (userId, expenseId, updates) => {
      const expenseRef = ref(
        db,
        getUserItemPath(userId, DB_PATHS.EXPENSES, expenseId)
      );

      const snapshot = await get(expenseRef);
      const existingExpense = snapshot.val() || {};
      const mergedExpense = { ...existingExpense, ...updates };

      const totalFields = getTotalCalculationFields(
        mergedExpense.sport || existingExpense.sport
      );

      const shouldRecalculate =
        totalFields.some((fieldName) => fieldName in updates) ||
        "playersCount" in updates ||
        "sport" in updates;

      const finalUpdates = {
        ...updates,
        updatedAt: now(),
      };

      if (shouldRecalculate) {
        const totals = calculateExpenseTotals(mergedExpense);

        finalUpdates.total = totals.total;
        finalUpdates.playersCount = totals.playersCount;
        finalUpdates.perPerson = totals.perPerson;
      }

      await update(expenseRef, finalUpdates);

      return expenseId;
    },

    delete: async (userId, expenseId) => {
      await remove(
        ref(db, getUserItemPath(userId, DB_PATHS.EXPENSES, expenseId))
      );

      return expenseId;
    },

    getByPeriod: (userId, month, year, callback) => {
      const expensesRef = ref(
        db,
        getUserCollectionPath(userId, DB_PATHS.EXPENSES)
      );

      const monthQuery = query(
        expensesRef,
        orderByChild("monthYear"),
        equalTo(`${month}_${year}`)
      );

      return listenToQuery(monthQuery, callback);
    },

    recalculateAllTotals: async (userId) => {
      const expensesRef = ref(
        db,
        getUserCollectionPath(userId, DB_PATHS.EXPENSES)
      );

      const snapshot = await get(expensesRef);
      const expenses = snapshot.val() || {};
      const updates = {};

      Object.keys(expenses).forEach((expenseId) => {
        const expense = expenses[expenseId];
        const totals = calculateExpenseTotals(expense);

        if (
          (expense.total || 0) !== totals.total ||
          (expense.perPerson || 0) !== totals.perPerson
        ) {
          const expensePath = getUserItemPath(
            userId,
            DB_PATHS.EXPENSES,
            expenseId
          );

          updates[`${expensePath}/total`] = totals.total;
          updates[`${expensePath}/playersCount`] = totals.playersCount;
          updates[`${expensePath}/perPerson`] = totals.perPerson;
          updates[`${expensePath}/updatedAt`] = now();
        }
      });

      if (Object.keys(updates).length === 0) {
        return null;
      }

      await update(ref(db), updates);

      return updates;
    },
  },

  payments: {
    create: async (userId, paymentData) => {
      const paymentId = createId(userId, DB_PATHS.PAYMENTS);
      const status = paymentData.status || "pending";

      const paymentWithId = {
        ...paymentData,
        id: paymentId,
        amount: paymentData.amount || 0,
        status,
        paidAt:
          paymentData.paidAt ||
          (status.toLowerCase() === "paid" ? now() : null),
        createdAt: now(),
        updatedAt: now(),
      };

      await set(
        ref(db, getUserItemPath(userId, DB_PATHS.PAYMENTS, paymentId)),
        paymentWithId
      );

      return paymentWithId;
    },

    getAll: (userId, callback) =>
      listenToPath(getUserCollectionPath(userId, DB_PATHS.PAYMENTS), callback),

    getById: (userId, paymentId) =>
      get(ref(db, getUserItemPath(userId, DB_PATHS.PAYMENTS, paymentId))),

    update: async (userId, paymentId, updates) => {
      const finalUpdates = {
        ...updates,
        updatedAt: now(),
      };

      if (
        updates.status &&
        updates.status.toLowerCase() === "paid" &&
        !updates.paidAt
      ) {
        finalUpdates.paidAt = now();
      }

      await update(
        ref(db, getUserItemPath(userId, DB_PATHS.PAYMENTS, paymentId)),
        finalUpdates
      );

      return paymentId;
    },

    delete: async (userId, paymentId) => {
      await remove(
        ref(db, getUserItemPath(userId, DB_PATHS.PAYMENTS, paymentId))
      );

      return paymentId;
    },

    getByPlayer: (userId, playerId, callback) => {
      const paymentsRef = ref(
        db,
        getUserCollectionPath(userId, DB_PATHS.PAYMENTS)
      );

      const playerQuery = query(
        paymentsRef,
        orderByChild("playerId"),
        equalTo(playerId)
      );

      return listenToQuery(playerQuery, callback);
    },

    getByStatus: (userId, status, callback) => {
      const paymentsRef = ref(
        db,
        getUserCollectionPath(userId, DB_PATHS.PAYMENTS)
      );

      const statusQuery = query(
        paymentsRef,
        orderByChild("status"),
        equalTo(status)
      );

      return listenToQuery(statusQuery, callback);
    },
  },

  attendance: {
    record: async (userId, attendanceData) => {
      const attendanceId = createId(userId, DB_PATHS.ATTENDANCE);

      const attendanceWithId = {
        ...attendanceData,
        id: attendanceId,
        recordedAt: now(),
        createdAt: now(),
      };

      await set(
        ref(db, getUserItemPath(userId, DB_PATHS.ATTENDANCE, attendanceId)),
        attendanceWithId
      );

      return attendanceWithId;
    },

    getAll: (userId, callback) =>
      listenToPath(
        getUserCollectionPath(userId, DB_PATHS.ATTENDANCE),
        callback
      ),

    getByPlayerAndDate: (userId, playerId, date, callback) => {
      const attendanceRef = ref(
        db,
        getUserCollectionPath(userId, DB_PATHS.ATTENDANCE)
      );

      const playerDateQuery = query(
        attendanceRef,
        orderByChild("playerId_date"),
        equalTo(`${playerId}_${date}`)
      );

      return listenToQuery(playerDateQuery, callback);
    },
  },
};

/**
 * Backward-compatible exports.
 * This lets your old pages keep working while you slowly update imports.
 */

export const teamsAPI = {
  createTeam: sportsAPI.teams.create,
  getTeams: sportsAPI.teams.getAll,
  getTeam: sportsAPI.teams.getById,
  updateTeam: sportsAPI.teams.update,
  deleteTeam: sportsAPI.teams.delete,
  getTeamsBySport: sportsAPI.teams.getBySport,
};

export const playersAPI = {
  createPlayer: sportsAPI.players.create,
  getPlayers: sportsAPI.players.getAll,
  getPlayer: sportsAPI.players.getById,
  updatePlayer: sportsAPI.players.update,
  deletePlayer: sportsAPI.players.delete,
  getPlayersByTeam: sportsAPI.players.getByTeam,
  getActivePlayers: sportsAPI.players.getActive,
};

export const expensesAPI = {
  createExpense: sportsAPI.expenses.create,
  getExpenses: sportsAPI.expenses.getAll,
  getExpense: sportsAPI.expenses.getById,
  updateExpense: sportsAPI.expenses.update,
  deleteExpense: sportsAPI.expenses.delete,
  getExpensesByPeriod: sportsAPI.expenses.getByPeriod,
  recalculateAllTotals: sportsAPI.expenses.recalculateAllTotals,
};

export const paymentsAPI = {
  createPayment: sportsAPI.payments.create,
  getPayments: sportsAPI.payments.getAll,
  getPayment: sportsAPI.payments.getById,
  updatePayment: sportsAPI.payments.update,
  deletePayment: sportsAPI.payments.delete,
  getPaymentsByPlayer: sportsAPI.payments.getByPlayer,
  getPaymentsByStatus: sportsAPI.payments.getByStatus,
};

export const attendanceAPI = {
  recordAttendance: sportsAPI.attendance.record,
  getAttendance: sportsAPI.attendance.getAll,
  getAttendanceByPlayer: sportsAPI.attendance.getByPlayerAndDate,
};

export default sportsAPI;