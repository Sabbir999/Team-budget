import { ref, set, get, update } from "firebase/database";
import { db } from "../firebase-config";
import { DB_PATHS } from "./paths";

export const userAPI = {
  createUser: (userId, userData) =>
    set(ref(db, `${DB_PATHS.USERS}/${userId}`), {
      ...userData,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }),

  getUser: (userId) => get(ref(db, `${DB_PATHS.USERS}/${userId}`)),

  updateUser: (userId, updates) =>
    update(ref(db, `${DB_PATHS.USERS}/${userId}`), {
      ...updates,
      updatedAt: Date.now(),
    }),

  getUserProfile: (userId) =>
    get(ref(db, `${DB_PATHS.USERS}/${userId}/profile`)),
};