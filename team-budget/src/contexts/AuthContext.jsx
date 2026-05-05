import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  updatePassword,
  updateEmail,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

import { auth } from "../firebase-config";

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signup = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const logout = () => signOut(auth);

  const updateUserProfile = (updates) => {
    if (!currentUser) {
      throw new Error("No user logged in");
    }

    return updateProfile(currentUser, updates);
  };

  const updateUserPassword = (newPassword) => {
    if (!currentUser) {
      throw new Error("No user logged in");
    }

    return updatePassword(currentUser, newPassword);
  };

  const updateUserEmail = (newEmail) => {
    if (!currentUser) {
      throw new Error("No user logged in");
    }

    return updateEmail(currentUser, newEmail);
  };

  const deleteUserAccount = () => {
    if (!currentUser) {
      throw new Error("No user logged in");
    }

    return deleteUser(currentUser);
  };

  const reauthenticateUser = (password) => {
    if (!currentUser || !currentUser.email) {
      throw new Error("No user logged in or email not available");
    }

    const credential = EmailAuthProvider.credential(
      currentUser.email,
      password
    );

    return reauthenticateWithCredential(currentUser, credential);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,

    signup,
    login,
    logout,

    updateUserProfile,
    updateUserPassword,
    updateUserEmail,
    deleteUserAccount,
    reauthenticateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}