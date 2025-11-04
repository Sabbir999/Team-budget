import React, { createContext, useContext, useEffect, useState } from 'react';
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
  EmailAuthProvider
} from 'firebase/auth';
import { auth } from '../firebase-config';

const AuthContext = createContext();

// Export the hook
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  // 🆕 UPDATE USER PROFILE (displayName, photoURL)
  function updateUserProfile(updates) {
    if (!currentUser) {
      throw new Error('No user logged in');
    }
    return updateProfile(currentUser, updates);
  }

  // 🆕 UPDATE USER PASSWORD
  function updateUserPassword(newPassword) {
    if (!currentUser) {
      throw new Error('No user logged in');
    }
    return updatePassword(currentUser, newPassword);
  }

  // 🆕 UPDATE USER EMAIL
  function updateUserEmail(newEmail) {
    if (!currentUser) {
      throw new Error('No user logged in');
    }
    return updateEmail(currentUser, newEmail);
  }

  // 🆕 DELETE USER ACCOUNT
  function deleteUserAccount() {
    if (!currentUser) {
      throw new Error('No user logged in');
    }
    return deleteUser(currentUser);
  }

  // 🆕 REAUTHENTICATE USER (required for sensitive operations)
  function reauthenticateUser(password) {
    if (!currentUser || !currentUser.email) {
      throw new Error('No user logged in or email not available');
    }
    
    const credential = EmailAuthProvider.credential(
      currentUser.email,
      password
    );
    
    return reauthenticateWithCredential(currentUser, credential);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    // 🆕 ADD NEW METHODS
    updateUserProfile,
    updateUserPassword,
    updateUserEmail,
    deleteUserAccount,
    reauthenticateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}