import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { 
  teamsAPI, 
  playersAPI, 
  expensesAPI, 
  paymentsAPI 
} from '../services/database';

const DataContext = createContext();

export function useData() {
  const context = useContext(DataContext);
  
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  
  return context;
}

export function DataProvider({ children }) {
  const { currentUser } = useAuth();
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load teams
  useEffect(() => {
    if (!currentUser) {
      setTeams([]);
      setCurrentTeam(null);
      setLoading(false);
      return;
    }

    console.log('🔄 Loading teams for user:', currentUser.uid);
    const unsubscribeTeams = teamsAPI.getTeams(currentUser.uid, (snapshot) => {
      const teamsData = snapshot.val();
      console.log('🏈 Teams data from Firebase:', teamsData);
      
      if (teamsData) {
        const teamsArray = Object.keys(teamsData).map(key => ({
          ...teamsData[key],
          id: key
        }));
        setTeams(teamsArray);
        
        // Set first team as current if none selected
        if (!currentTeam && teamsArray.length > 0) {
          setCurrentTeam(teamsArray[0]);
        }
      } else {
        setTeams([]);
      }
      setLoading(false);
    });

    return () => unsubscribeTeams();
  }, [currentUser, currentTeam]);

  // Load players
  useEffect(() => {
    if (!currentUser) {
      setPlayers([]);
      return;
    }

    console.log('🔄 Loading players for user:', currentUser.uid);
    const unsubscribePlayers = playersAPI.getPlayers(currentUser.uid, (snapshot) => {
      const playersData = snapshot.val();
      console.log('👥 Players data from Firebase:', playersData);
      
      if (playersData) {
        const playersArray = Object.keys(playersData).map(key => ({
          ...playersData[key],
          id: key
        }));
        setPlayers(playersArray);
        console.log('✅ Players loaded:', playersArray.length);
      } else {
        setPlayers([]);
        console.log('❌ No players found in database');
      }
    });

    return () => unsubscribePlayers();
  }, [currentUser]);

  // Load expenses
  useEffect(() => {
    if (!currentUser) {
      setExpenses([]);
      return;
    }

    const unsubscribeExpenses = expensesAPI.getExpenses(currentUser.uid, (snapshot) => {
      const expensesData = snapshot.val();
      if (expensesData) {
        const expensesArray = Object.keys(expensesData).map(key => ({
          ...expensesData[key],
          id: key
        }));
        setExpenses(expensesArray);
      } else {
        setExpenses([]);
      }
    });

    return () => unsubscribeExpenses();
  }, [currentUser]);

  // Load payments
  useEffect(() => {
    if (!currentUser) {
      setPayments([]);
      return;
    }

    const unsubscribePayments = paymentsAPI.getPayments(currentUser.uid, (snapshot) => {
      const paymentsData = snapshot.val();
      if (paymentsData) {
        const paymentsArray = Object.keys(paymentsData).map(key => ({
          ...paymentsData[key],
          id: key
        }));
        setPayments(paymentsArray);
      } else {
        setPayments([]);
      }
    });

    return () => unsubscribePayments();
  }, [currentUser]);

  // Team management functions
  const createTeam = async (teamData) => {
    if (!currentUser) throw new Error('No user logged in');
    return teamsAPI.createTeam(currentUser.uid, teamData);
  };

  const updateTeam = async (teamId, updates) => {
    if (!currentUser) throw new Error('No user logged in');
    return teamsAPI.updateTeam(currentUser.uid, teamId, updates);
  };

  const deleteTeam = async (teamId) => {
    if (!currentUser) throw new Error('No user logged in');
    return teamsAPI.deleteTeam(currentUser.uid, teamId);
  };

  // Player management functions
  const createPlayer = async (playerData) => {
    if (!currentUser) throw new Error('No user logged in');
    console.log('➕ Creating player:', playerData);
    const result = await playersAPI.createPlayer(currentUser.uid, playerData);
    console.log('✅ Player created successfully:', result);
    return result;
  };

  const updatePlayer = async (playerId, updates) => {
    if (!currentUser) throw new Error('No user logged in');
    return playersAPI.updatePlayer(currentUser.uid, playerId, updates);
  };

  const deletePlayer = async (playerId) => {
    if (!currentUser) throw new Error('No user logged in');
    return playersAPI.deletePlayer(currentUser.uid, playerId);
  };

  // Expense management functions
  const createExpense = async (expenseData) => {
    if (!currentUser) throw new Error('No user logged in');
    return expensesAPI.createExpense(currentUser.uid, expenseData);
  };

  const updateExpense = async (expenseId, updates) => {
    if (!currentUser) throw new Error('No user logged in');
    return expensesAPI.updateExpense(currentUser.uid, expenseId, updates);
  };

  const deleteExpense = async (expenseId) => {
    if (!currentUser) throw new Error('No user logged in');
    return expensesAPI.deleteExpense(currentUser.uid, expenseId);
  };

  // Payment management functions
  const createPayment = async (paymentData) => {
    if (!currentUser) throw new Error('No user logged in');
    return paymentsAPI.createPayment(currentUser.uid, paymentData);
  };

  const updatePayment = async (paymentId, updates) => {
    if (!currentUser) throw new Error('No user logged in');
    return paymentsAPI.updatePayment(currentUser.uid, paymentId, updates);
  };

  const deletePayment = async (paymentId) => {
    if (!currentUser) throw new Error('No user logged in');
    return paymentsAPI.deletePayment(currentUser.uid, paymentId);
  };

  const value = {
    // Data
    teams,
    players,
    expenses,
    payments,
    currentTeam,
    loading,
    
    // Team actions
    createTeam,
    updateTeam,
    deleteTeam,
    setCurrentTeam,
    
    // Player actions  
    createPlayer,
    updatePlayer,
    deletePlayer,
    
    // Expense actions
    createExpense,
    updateExpense,
    deleteExpense,
    
    // Payment actions
    createPayment,
    updatePayment,
    deletePayment
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}