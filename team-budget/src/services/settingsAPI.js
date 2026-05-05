import { ref, set, onValue, off } from "firebase/database";
import { db } from "../firebase-config";
import { DB_PATHS } from "./paths";

export const settingsAPI = {
  saveSettings: (userId, settings) =>
    set(ref(db, `${DB_PATHS.USERS}/${userId}/${DB_PATHS.SETTINGS}`), {
      ...settings,
      updatedAt: Date.now(),
    }),

  getSettings: (userId, callback) => {
    const settingsRef = ref(
      db,
      `${DB_PATHS.USERS}/${userId}/${DB_PATHS.SETTINGS}`
    );

    const unsubscribe = onValue(settingsRef, (snapshot) => {
      callback(snapshot);
    });

    return () => off(settingsRef, "value", unsubscribe);
  },
};

export default settingsAPI;