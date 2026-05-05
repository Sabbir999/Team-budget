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
const TRIP_PAYMENTS_KEY = DB_PATHS.TRIP_PAYMENTS || "tripPayments";

const getTripPaymentsPath = (userId, tripId) =>
  `${DB_PATHS.USERS}/${userId}/${TRIPS_KEY}/${tripId}/${TRIP_PAYMENTS_KEY}`;

const getTripPaymentPath = (userId, tripId, paymentId) =>
  `${getTripPaymentsPath(userId, tripId)}/${paymentId}`;

const listenToPath = (path, callback, errorMessage) => {
  const pathRef = ref(db, path);

  const unsubscribe = onValue(
    pathRef,
    callback,
    (error) => console.error(errorMessage, error)
  );

  return () => off(pathRef, "value", unsubscribe);
};

export const tripPaymentsAPI = {
  getTripPayments: (userId, tripId, callback) =>
    listenToPath(
      getTripPaymentsPath(userId, tripId),
      callback,
      "Trip payments listener error:"
    ),

  createTripPayment: async (userId, tripId, paymentData) => {
    const paymentId = push(ref(db, getTripPaymentsPath(userId, tripId))).key;

    const paymentWithId = {
      ...paymentData,
      id: paymentId,
      amount: Number(paymentData.amount) || 0,
      createdAt: now(),
      updatedAt: now(),
    };

    await set(
      ref(db, getTripPaymentPath(userId, tripId, paymentId)),
      paymentWithId
    );

    return paymentWithId;
  },

  getTripPayment: (userId, tripId, paymentId) =>
    get(ref(db, getTripPaymentPath(userId, tripId, paymentId))),

  updateTripPayment: async (userId, tripId, paymentId, updates) => {
    const finalUpdates = {
      ...updates,
      updatedAt: now(),
    };

    if (updates.amount !== undefined) {
      finalUpdates.amount = Number(updates.amount) || 0;
    }

    await update(
      ref(db, getTripPaymentPath(userId, tripId, paymentId)),
      finalUpdates
    );

    return paymentId;
  },

  deleteTripPayment: async (userId, tripId, paymentId) => {
    await remove(ref(db, getTripPaymentPath(userId, tripId, paymentId)));

    return paymentId;
  },
};

export default tripPaymentsAPI;
