import { ref, get, update } from "firebase/database";
import { db } from "../firebase-config";

export const databaseUtils = {
  exists: (path) => get(ref(db, path)).then((snapshot) => snapshot.exists()),

  getMultiple: (path, ids) =>
    Promise.all(ids.map((id) => get(ref(db, `${path}/${id}`)))),

  batchUpdate: (updates) => update(ref(db), updates),

  batchDelete: (paths) => {
    const updates = {};

    paths.forEach((path) => {
      updates[path] = null;
    });

    return update(ref(db), updates);
  },
};