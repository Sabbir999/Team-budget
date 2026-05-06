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

const PEOPLE_KEY = DB_PATHS.PEOPLE || "people";
const now = () => Date.now();

const getPeoplePath = (userId) => `${DB_PATHS.USERS}/${userId}/${PEOPLE_KEY}`;

const getPersonPath = (userId, personId) =>
  `${getPeoplePath(userId)}/${personId}`;

const listenToPath = (path, callback, errorMessage) => {
  const pathRef = ref(db, path);

  const unsubscribe = onValue(
    pathRef,
    callback,
    (error) => console.error(errorMessage, error)
  );

  return () => off(pathRef, "value", unsubscribe);
};

const normalizePerson = (personData = {}) => ({
  name: personData.name?.trim() || "",
  email: personData.email?.trim() || "",
  phone: personData.phone?.trim() || "",
  zelle: personData.zelle?.trim() || personData.email?.trim() || "",
  notes: personData.notes || "",
  avatarColor: personData.avatarColor || "blue",
});

export const peopleAPI = {
  createPerson: async (userId, personData) => {
    const personId = push(ref(db, getPeoplePath(userId))).key;

    const personWithId = {
      ...normalizePerson(personData),
      id: personId,
      archived: false,
      createdAt: now(),
      updatedAt: now(),
    };

    await set(ref(db, getPersonPath(userId, personId)), personWithId);

    return personWithId;
  },

  getPeople: (userId, callback) =>
    listenToPath(getPeoplePath(userId), callback, "People listener error:"),

  getPerson: (userId, personId) =>
    get(ref(db, getPersonPath(userId, personId))),

  updatePerson: async (userId, personId, updates) => {
    const personRef = ref(db, getPersonPath(userId, personId));

    const existingSnapshot = await get(personRef);
    const existingPerson = existingSnapshot.val() || {};

    await update(personRef, {
      ...normalizePerson({
        ...existingPerson,
        ...updates,
      }),
      archived: updates.archived ?? existingPerson.archived ?? false,
      archivedAt: updates.archivedAt ?? existingPerson.archivedAt ?? null,
      updatedAt: now(),
    });

    return personId;
  },

  archivePerson: async (userId, personId) => {
    await update(ref(db, getPersonPath(userId, personId)), {
      archived: true,
      archivedAt: now(),
      updatedAt: now(),
    });

    return personId;
  },

  restorePerson: async (userId, personId) => {
    await update(ref(db, getPersonPath(userId, personId)), {
      archived: false,
      archivedAt: null,
      updatedAt: now(),
    });

    return personId;
  },

  deletePerson: async (userId, personId) => {
    await remove(ref(db, getPersonPath(userId, personId)));

    return personId;
  },
};

export default peopleAPI;