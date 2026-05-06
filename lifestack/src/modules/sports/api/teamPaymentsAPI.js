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
const TEAM_PAYMENTS_KEY = DB_PATHS.TEAM_PAYMENTS || "teamPayments";

const getTeamPaymentsPath = (userId, teamId) =>
  `${DB_PATHS.USERS}/${userId}/${TEAMS_KEY}/${teamId}/${TEAM_PAYMENTS_KEY}`;

const getTeamPaymentPath = (userId, teamId, paymentId) =>
  `${getTeamPaymentsPath(userId, teamId)}/${paymentId}`;

const listenToPath = (path, callback, errorMessage) => {
  const pathRef = ref(db, path);

  const unsubscribe = onValue(
    pathRef,
    callback,
    (error) => console.error(errorMessage, error)
  );

  return () => off(pathRef, "value", unsubscribe);
};

export const teamPaymentsAPI = {
  getTeamPayments: (userId, teamId, callback) =>
    listenToPath(
      getTeamPaymentsPath(userId, teamId),
      callback,
      "Team payments listener error:"
    ),

  createTeamPayment: async (userId, teamId, paymentData) => {
    const paymentId = push(ref(db, getTeamPaymentsPath(userId, teamId))).key;

    const paymentWithId = {
      ...paymentData,
      id: paymentId,
      amount: Number(paymentData.amount) || 0,
      createdAt: now(),
      updatedAt: now(),
    };

    await set(ref(db, getTeamPaymentPath(userId, teamId, paymentId)), paymentWithId);

    return paymentWithId;
  },

  getTeamPayment: (userId, teamId, paymentId) =>
    get(ref(db, getTeamPaymentPath(userId, teamId, paymentId))),

  updateTeamPayment: async (userId, teamId, paymentId, updates) => {
    const finalUpdates = {
      ...updates,
      updatedAt: now(),
    };

    if (updates.amount !== undefined) {
      finalUpdates.amount = Number(updates.amount) || 0;
    }

    await update(ref(db, getTeamPaymentPath(userId, teamId, paymentId)), finalUpdates);

    return paymentId;
  },

  deleteTeamPayment: async (userId, teamId, paymentId) => {
    await remove(ref(db, getTeamPaymentPath(userId, teamId, paymentId)));

    return paymentId;
  },
};

export default teamPaymentsAPI;
