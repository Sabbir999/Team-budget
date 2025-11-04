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
  const [allPlayers, setAllPlayers] = useState([]);
  const [allExpenses, setAllExpenses] = useState([]);
  const [allPayments, setAllPayments] = useState([]);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [currentSport, setCurrentSport] = useState('badminton'); // 🆕 ADD SPORT STATE
  const [loading, setLoading] = useState(true);

  // Filtered data based on current team
  const players = currentTeam 
    ? allPlayers.filter(p => p.teamId === currentTeam.id)
    : allPlayers;

  const expenses = currentTeam
    ? allExpenses.filter(e => e.teamId === currentTeam.id)
    : allExpenses;

  const payments = currentTeam
    ? allPayments.filter(p => p.teamId === currentTeam.id)
    : allPayments;

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
        
        // Set first team as current if none selected or current team no longer exists
        if (!currentTeam || !teamsArray.find(t => t.id === currentTeam.id)) {
          if (teamsArray.length > 0) {
            setCurrentTeam(teamsArray[0]);
            console.log('✅ Set first team as current:', teamsArray[0].name);
          }
        }
      } else {
        setTeams([]);
        setCurrentTeam(null);
      }
      setLoading(false);
    });

    return () => unsubscribeTeams();
  }, [currentUser]);

  // Update current team when it's manually changed
  const handleSetCurrentTeam = (team) => {
    console.log('🔄 Switching to team:', team.name);
    setCurrentTeam(team);
    
    // Store in localStorage for persistence
    if (team) {
      localStorage.setItem('currentTeamId', team.id);
    } else {
      localStorage.removeItem('currentTeamId');
    }
  };

  // 🆕 UPDATE CURRENT SPORT
  const handleSetCurrentSport = (sport) => {
    console.log('🔄 Switching to sport:', sport);
    setCurrentSport(sport);
    
    // Store in localStorage for persistence
    if (sport) {
      localStorage.setItem('currentSport', sport);
    } else {
      localStorage.removeItem('currentSport');
    }
  };

  // Restore current team from localStorage on mount
  useEffect(() => {
    if (teams.length > 0) {
      const savedTeamId = localStorage.getItem('currentTeamId');
      if (savedTeamId) {
        const savedTeam = teams.find(t => t.id === savedTeamId);
        if (savedTeam) {
          setCurrentTeam(savedTeam);
          console.log('✅ Restored team from localStorage:', savedTeam.name);
        }
      }
    }
  }, [teams]);

  // 🆕 RESTORE CURRENT SPORT FROM LOCALSTORAGE
  useEffect(() => {
    const savedSport = localStorage.getItem('currentSport');
    if (savedSport) {
      setCurrentSport(savedSport);
      console.log('✅ Restored sport from localStorage:', savedSport);
    }
  }, []);

  // Load all players
  useEffect(() => {
    if (!currentUser) {
      setAllPlayers([]);
      return;
    }

    console.log('🔄 Loading all players for user:', currentUser.uid);
    const unsubscribePlayers = playersAPI.getPlayers(currentUser.uid, (snapshot) => {
      const playersData = snapshot.val();
      console.log('👥 Players data from Firebase:', playersData);
      
      if (playersData) {
        const playersArray = Object.keys(playersData).map(key => ({
          ...playersData[key],
          id: key
        }));
        setAllPlayers(playersArray);
        console.log('✅ All players loaded:', playersArray.length);
      } else {
        setAllPlayers([]);
        console.log('❌ No players found in database');
      }
    });

    return () => unsubscribePlayers();
  }, [currentUser]);

  // Load all expenses
  useEffect(() => {
    if (!currentUser) {
      setAllExpenses([]);
      return;
    }

    console.log('🔄 Loading all expenses for user:', currentUser.uid);
    const unsubscribeExpenses = expensesAPI.getExpenses(currentUser.uid, (snapshot) => {
      const expensesData = snapshot.val();
      if (expensesData) {
        const expensesArray = Object.keys(expensesData).map(key => ({
          ...expensesData[key],
          id: key
        }));
        setAllExpenses(expensesArray);
        console.log('✅ All expenses loaded:', expensesArray.length);
      } else {
        setAllExpenses([]);
      }
    });

    return () => unsubscribeExpenses();
  }, [currentUser]);

  // Load all payments
  useEffect(() => {
    if (!currentUser) {
      setAllPayments([]);
      return;
    }

    console.log('🔄 Loading all payments for user:', currentUser.uid);
    const unsubscribePayments = paymentsAPI.getPayments(currentUser.uid, (snapshot) => {
      const paymentsData = snapshot.val();
      if (paymentsData) {
        const paymentsArray = Object.keys(paymentsData).map(key => ({
          ...paymentsData[key],
          id: key
        }));
        setAllPayments(paymentsArray);
        console.log('✅ All payments loaded:', paymentsArray.length);
      } else {
        setAllPayments([]);
      }
    });

    return () => unsubscribePayments();
  }, [currentUser]);

  // Team management functions
  const createTeam = async (teamData) => {
    if (!currentUser) throw new Error('No user logged in');
    const newTeam = await teamsAPI.createTeam(currentUser.uid, teamData);
    
    // Set newly created team as current
    if (newTeam) {
      setCurrentTeam(newTeam);
    }
    
    return newTeam;
  };

  const updateTeam = async (teamId, updates) => {
    if (!currentUser) throw new Error('No user logged in');
    await teamsAPI.updateTeam(currentUser.uid, teamId, updates);
    
    // Update current team if it's the one being updated
    if (currentTeam && currentTeam.id === teamId) {
      setCurrentTeam({ ...currentTeam, ...updates });
    }
  };

  const deleteTeam = async (teamId) => {
    if (!currentUser) throw new Error('No user logged in');
    await teamsAPI.deleteTeam(currentUser.uid, teamId);
    
    // If deleted team was current, switch to another team
    if (currentTeam && currentTeam.id === teamId) {
      const remainingTeams = teams.filter(t => t.id !== teamId);
      setCurrentTeam(remainingTeams.length > 0 ? remainingTeams[0] : null);
    }
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

  // 🆕 UPDATED EXPENSE MANAGEMENT FUNCTIONS - Include sport
  const createExpense = async (expenseData) => {
    if (!currentUser) throw new Error('No user logged in');
    
    // Ensure sport is included in expense data
    const expenseWithSport = {
      ...expenseData,
      sport: currentSport, // 🆕 Include current sport
      createdAt: new Date().toISOString()
    };
    
    console.log('➕ Creating expense with sport:', expenseWithSport.sport);
    return expensesAPI.createExpense(currentUser.uid, expenseWithSport);
  };

  const updateExpense = async (expenseId, updates) => {
    if (!currentUser) throw new Error('No user logged in');
    
    // Ensure sport is preserved if not provided in updates
    const updatesWithSport = {
      ...updates,
      sport: updates.sport || currentSport // 🆕 Preserve sport
    };
    
    return expensesAPI.updateExpense(currentUser.uid, expenseId, updatesWithSport);
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
    // Data - filtered by current team
    teams,
    players,
    expenses,
    payments,
    currentTeam,
    currentSport, // 🆕 EXPORT CURRENT SPORT
    loading,
    
    // Unfiltered data for reference
    allPlayers,
    allExpenses,
    allPayments,
    
    // Team actions
    createTeam,
    updateTeam,
    deleteTeam,
    setCurrentTeam: handleSetCurrentTeam,
    
    // 🆕 SPORT ACTIONS
    setCurrentSport: handleSetCurrentSport,
    
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