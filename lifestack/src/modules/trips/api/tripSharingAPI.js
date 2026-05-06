import { ref, get, set, push } from "firebase/database";

import { db } from "../../../firebase-config";
import { DB_PATHS } from "../../../services/paths";

const now = () => Date.now();

const USERS_KEY = DB_PATHS.USERS || "users";
const TRIPS_KEY = DB_PATHS.TRIPS || "trips";
const TRIP_EXPENSES_KEY = DB_PATHS.TRIP_EXPENSES || "tripExpenses";
const TRIP_PAYMENTS_KEY = DB_PATHS.TRIP_PAYMENTS || "tripPayments";
const PEOPLE_KEY = DB_PATHS.PEOPLE || "people";

const snapshotToArray = (snapshot) => {
  const data = snapshot.val();

  if (!data) {
    return [];
  }

  return Object.keys(data).map((key) => ({
    ...data[key],
    id: data[key].id || key,
  }));
};

const getTripPath = (userId, tripId) =>
  `${USERS_KEY}/${userId}/${TRIPS_KEY}/${tripId}`;

const getTripExpensesPath = (userId, tripId) =>
  `${getTripPath(userId, tripId)}/${TRIP_EXPENSES_KEY}`;

const getTripPaymentsPath = (userId, tripId) =>
  `${getTripPath(userId, tripId)}/${TRIP_PAYMENTS_KEY}`;

const getPeoplePath = (userId) => `${USERS_KEY}/${userId}/${PEOPLE_KEY}`;

function hydrateSharedMembers(tripMembers = [], people = []) {
  return tripMembers.map((member) => {
    const personId = member.personId || member.id;
    const profile = people.find((person) => person.id === personId);

    return {
      ...member,
      personId,
      name:
        profile?.name ||
        member.name ||
        member.displayName ||
        "Unknown person",
      email: profile?.email || member.email || "",
      phone: profile?.phone || member.phone || "",
      zelle: profile?.zelle || member.zelle || "",
      globalProfile: profile || null,
    };
  });
}

export const tripSharingAPI = {
  createReadOnlyShare: async (userId, tripId) => {
    const [tripSnapshot, expensesSnapshot, paymentsSnapshot, peopleSnapshot] =
      await Promise.all([
        get(ref(db, getTripPath(userId, tripId))),
        get(ref(db, getTripExpensesPath(userId, tripId))),
        get(ref(db, getTripPaymentsPath(userId, tripId))),
        get(ref(db, getPeoplePath(userId))),
      ]);

    const trip = tripSnapshot.val();

    if (!trip) {
      throw new Error("Trip not found.");
    }

    const expenses = snapshotToArray(expensesSnapshot);
    const payments = snapshotToArray(paymentsSnapshot);
    const people = snapshotToArray(peopleSnapshot);
    const members = hydrateSharedMembers(trip.members || [], people);

    const shareId = push(ref(db, "sharedTrips")).key;

    const sharedTrip = {
      id: shareId,
      ownerId: userId,
      tripId,
      access: "view",
      tripSnapshot: {
        trip: {
          ...trip,
          id: trip.id || tripId,
        },
        members,
        expenses,
        payments,
      },
      createdAt: now(),
      updatedAt: now(),
    };

    await set(ref(db, `sharedTrips/${shareId}`), sharedTrip);

    return sharedTrip;
  },

  getSharedTrip: async (shareId) => {
    const snapshot = await get(ref(db, `sharedTrips/${shareId}`));

    if (!snapshot.exists()) {
      throw new Error("Shared trip not found.");
    }

    return snapshot.val();
  },
};

export default tripSharingAPI;

