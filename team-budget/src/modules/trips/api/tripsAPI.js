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

const TRIPS_KEY = DB_PATHS.TRIPS || "trips";
const TRIP_EXPENSES_KEY = DB_PATHS.TRIP_EXPENSES || "tripExpenses";

const getTripsPath = (userId) => `${DB_PATHS.USERS}/${userId}/${TRIPS_KEY}`;
const getTripPath = (userId, tripId) => `${getTripsPath(userId)}/${tripId}`;
const getTripExpensesPath = (userId, tripId) =>
  `${getTripPath(userId, tripId)}/${TRIP_EXPENSES_KEY}`;
const getTripExpensePath = (userId, tripId, expenseId) =>
  `${getTripExpensesPath(userId, tripId)}/${expenseId}`;

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
    .filter((member) => member.personId || member.id)
    .map((member) => ({
      personId: member.personId || member.id,
      role: member.role || "Member",
      paymentStatus: member.paymentStatus || "unpaid",
      paidAmount: Number(member.paidAmount) || 0,
      partialPayments: member.partialPayments || [],
      joinedAt: member.joinedAt || now(),
    }));

export const tripsAPI = {
  createTrip: async (userId, tripData) => {
    const tripId = push(ref(db, getTripsPath(userId))).key;

    const tripWithId = {
      ...tripData,
      id: tripId,
      members: normalizeMembers(tripData.members || []),
      customCategories: tripData.customCategories || [],
      createdBy: userId,
      createdAt: now(),
      updatedAt: now(),
    };

    await set(ref(db, getTripPath(userId, tripId)), tripWithId);

    return tripWithId;
  },

  getTrips: (userId, callback) =>
    listenToPath(getTripsPath(userId), callback, "Trips listener error:"),

  getTrip: (userId, tripId) => get(ref(db, getTripPath(userId, tripId))),

  updateTrip: async (userId, tripId, updates) => {
    const finalUpdates = {
      ...updates,
      updatedAt: now(),
    };

    if (updates.members) {
      finalUpdates.members = normalizeMembers(updates.members);
    }

    await update(ref(db, getTripPath(userId, tripId)), finalUpdates);

    return tripId;
  },

  deleteTrip: async (userId, tripId) => {
    await remove(ref(db, getTripPath(userId, tripId)));

    return tripId;
  },

  updateTripMembers: async (userId, tripId, members) => {
    await update(ref(db, getTripPath(userId, tripId)), {
      members: normalizeMembers(members),
      updatedAt: now(),
    });

    return tripId;
  },

  updateTripMemberStatus: async (
    userId,
    tripId,
    personId,
    status,
    paymentData = null
  ) => {
    const tripSnapshot = await get(ref(db, getTripPath(userId, tripId)));
    const trip = tripSnapshot.val();

    if (!trip) {
      throw new Error("Trip not found");
    }

    const members = (trip.members || []).map((member) => {
      const memberId = member.personId || member.id;

      if (memberId !== personId) {
        return member;
      }

      if (status === "unpaid") {
        return {
          ...member,
          personId: memberId,
          paymentStatus: "unpaid",
          paidAmount: 0,
          partialPayments: [],
        };
      }

      if (status === "paid") {
        const existingPayments = member.partialPayments || [];

        const finalPaymentAmount = Number(paymentData?.finalPaymentAmount) || 0;

        const finalPayment =
          finalPaymentAmount > 0
            ? {
                id: `payment_${Date.now()}`,
                amount: finalPaymentAmount,
                note: paymentData?.note || "Marked paid",
                createdAt: now(),
              }
            : null;

        return {
          ...member,
          personId: memberId,
          paymentStatus: "paid",
          paidAmount:
            Number(paymentData?.paidAmount) ||
            Number(member.paidAmount) ||
            0,
          partialPayments: finalPayment
            ? [...existingPayments, finalPayment]
            : existingPayments,
        };
      }

      if (status === "partial") {
        const partialPayment = paymentData?.partialPayment || paymentData;
        const previousPaidAmount = Number(member.paidAmount) || 0;

        const nextPaidAmount =
          paymentData?.paidAmount !== undefined
            ? Number(paymentData.paidAmount) || 0
            : previousPaidAmount + (Number(partialPayment?.amount) || 0);

        const nextPartialPayments =
          Number(partialPayment?.amount) > 0
            ? [
                ...(member.partialPayments || []),
                {
                  id: `partial_${Date.now()}`,
                  amount: Number(partialPayment.amount) || 0,
                  note: partialPayment.note || "",
                  createdAt: now(),
                },
              ]
            : member.partialPayments || [];

        return {
          ...member,
          personId: memberId,
          paymentStatus: "partial",
          paidAmount: nextPaidAmount,
          partialPayments: nextPartialPayments,
        };
      }

      return member;
    });

    await update(ref(db, getTripPath(userId, tripId)), {
      members: normalizeMembers(members),
      updatedAt: now(),
    });

    return normalizeMembers(members);
  },

  removeTripMember: async (userId, tripId, personId) => {
    const tripSnapshot = await get(ref(db, getTripPath(userId, tripId)));
    const trip = tripSnapshot.val();

    if (!trip) {
      throw new Error("Trip not found");
    }

    const updatedMembers = (trip.members || []).filter((member) => {
      const memberId = member.personId || member.id;
      return memberId !== personId;
    });

    await update(ref(db, getTripPath(userId, tripId)), {
      members: normalizeMembers(updatedMembers),
      updatedAt: now(),
    });

    return normalizeMembers(updatedMembers);
  },

  createTripExpense: async (userId, tripId, expenseData) => {
    const expenseId = push(ref(db, getTripExpensesPath(userId, tripId))).key;

    const expenseWithId = {
      ...expenseData,
      id: expenseId,
      amount: Number(expenseData.amount) || 0,
      splitBetween: expenseData.splitBetween || [],
      status: expenseData.status || "unpaid",
      createdAt: now(),
      updatedAt: now(),
    };

    await set(
      ref(db, getTripExpensePath(userId, tripId, expenseId)),
      expenseWithId
    );

    return expenseWithId;
  },

  getTripExpenses: (userId, tripId, callback) =>
    listenToPath(
      getTripExpensesPath(userId, tripId),
      callback,
      "Trip expenses listener error:"
    ),

  updateTripExpense: async (userId, tripId, expenseId, updates) => {
    const finalUpdates = {
      ...updates,
      updatedAt: now(),
    };

    if (updates.amount !== undefined) {
      finalUpdates.amount = Number(updates.amount) || 0;
    }

    await update(
      ref(db, getTripExpensePath(userId, tripId, expenseId)),
      finalUpdates
    );

    return expenseId;
  },

  deleteTripExpense: async (userId, tripId, expenseId) => {
    await remove(ref(db, getTripExpensePath(userId, tripId, expenseId)));

    return expenseId;
  },
};

export default tripsAPI;