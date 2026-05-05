import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import {
  teamsAPI,
  playersAPI,
  expensesAPI,
  paymentsAPI,
} from "../modules/sports/api/sportsAPI";

const DataContext = createContext();

export function useData() {
  const context = useContext(DataContext);

  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }

  return context;
}

const convertSnapshotToArray = (snapshot) => {
  const data = snapshot.val();

  if (!data) {
    return [];
  }

  return Object.keys(data).map((key) => ({
    ...data[key],
    id: data[key].id || key,
  }));
};

export function DataProvider({ children }) {
  const { currentUser } = useAuth();

  const [teams, setTeams] = useState([]);
  const [allPlayers, setAllPlayers] = useState([]);
  const [allExpenses, setAllExpenses] = useState([]);
  const [allPayments, setAllPayments] = useState([]);

  const [currentTeam, setCurrentTeam] = useState(null);
  const [currentSport, setCurrentSport] = useState("badminton");
  const [loading, setLoading] = useState(true);

  const players = currentTeam
    ? allPlayers.filter((player) => player.teamId === currentTeam.id)
    : allPlayers;

  const expenses = currentTeam
    ? allExpenses.filter((expense) => expense.teamId === currentTeam.id)
    : allExpenses;

  const payments = currentTeam
    ? allPayments.filter((payment) => payment.teamId === currentTeam.id)
    : allPayments;

  useEffect(() => {
    const savedSport = localStorage.getItem("currentSport");

    if (savedSport) {
      setCurrentSport(savedSport);
    }
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setTeams([]);
      setCurrentTeam(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribeTeams = teamsAPI.getTeams(currentUser.uid, (snapshot) => {
      const teamsArray = convertSnapshotToArray(snapshot);

      setTeams(teamsArray);

      if (teamsArray.length === 0) {
        setCurrentTeam(null);
        setLoading(false);
        return;
      }

      const savedTeamId = localStorage.getItem("currentTeamId");
      const savedTeam = savedTeamId
        ? teamsArray.find((team) => team.id === savedTeamId)
        : null;

      setCurrentTeam((previousTeam) => {
        if (previousTeam) {
          const stillExists = teamsArray.find(
            (team) => team.id === previousTeam.id
          );

          if (stillExists) {
            return stillExists;
          }
        }

        return savedTeam || teamsArray[0];
      });

      setLoading(false);
    });

    return () => unsubscribeTeams();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) {
      setAllPlayers([]);
      return;
    }

    const unsubscribePlayers = playersAPI.getPlayers(
      currentUser.uid,
      (snapshot) => {
        setAllPlayers(convertSnapshotToArray(snapshot));
      }
    );

    return () => unsubscribePlayers();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) {
      setAllExpenses([]);
      return;
    }

    const unsubscribeExpenses = expensesAPI.getExpenses(
      currentUser.uid,
      (snapshot) => {
        setAllExpenses(convertSnapshotToArray(snapshot));
      }
    );

    return () => unsubscribeExpenses();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) {
      setAllPayments([]);
      return;
    }

    const unsubscribePayments = paymentsAPI.getPayments(
      currentUser.uid,
      (snapshot) => {
        setAllPayments(convertSnapshotToArray(snapshot));
      }
    );

    return () => unsubscribePayments();
  }, [currentUser]);

  const handleSetCurrentTeam = (team) => {
    setCurrentTeam(team);

    if (team) {
      localStorage.setItem("currentTeamId", team.id);
      return;
    }

    localStorage.removeItem("currentTeamId");
  };

  const handleSetCurrentSport = (sport) => {
    setCurrentSport(sport);

    if (sport) {
      localStorage.setItem("currentSport", sport);
      return;
    }

    localStorage.removeItem("currentSport");
  };

  const createTeam = async (teamData) => {
    if (!currentUser) {
      throw new Error("No user logged in");
    }

    const newTeam = await teamsAPI.createTeam(currentUser.uid, teamData);

    if (newTeam) {
      setCurrentTeam(newTeam);
      localStorage.setItem("currentTeamId", newTeam.id);
    }

    return newTeam;
  };

  const updateTeam = async (teamId, updates) => {
    if (!currentUser) {
      throw new Error("No user logged in");
    }

    await teamsAPI.updateTeam(currentUser.uid, teamId, updates);

    if (currentTeam && currentTeam.id === teamId) {
      setCurrentTeam({
        ...currentTeam,
        ...updates,
        updatedAt: Date.now(),
      });
    }
  };

  const deleteTeam = async (teamId) => {
    if (!currentUser) {
      throw new Error("No user logged in");
    }

    await teamsAPI.deleteTeam(currentUser.uid, teamId);

    if (currentTeam && currentTeam.id === teamId) {
      const remainingTeams = teams.filter((team) => team.id !== teamId);
      const nextTeam = remainingTeams.length > 0 ? remainingTeams[0] : null;

      setCurrentTeam(nextTeam);

      if (nextTeam) {
        localStorage.setItem("currentTeamId", nextTeam.id);
      } else {
        localStorage.removeItem("currentTeamId");
      }
    }
  };

  const createPlayer = async (playerData) => {
    if (!currentUser) {
      throw new Error("No user logged in");
    }

    return playersAPI.createPlayer(currentUser.uid, playerData);
  };

  const updatePlayer = async (playerId, updates) => {
    if (!currentUser) {
      throw new Error("No user logged in");
    }

    return playersAPI.updatePlayer(currentUser.uid, playerId, updates);
  };

  const deletePlayer = async (playerId) => {
    if (!currentUser) {
      throw new Error("No user logged in");
    }

    return playersAPI.deletePlayer(currentUser.uid, playerId);
  };

  const createExpense = async (expenseData) => {
    if (!currentUser) {
      throw new Error("No user logged in");
    }

    const expenseWithSport = {
      ...expenseData,
      sport: expenseData.sport || currentSport,
      teamId: expenseData.teamId || currentTeam?.id || null,
    };

    return expensesAPI.createExpense(currentUser.uid, expenseWithSport);
  };

  const updateExpense = async (expenseId, updates) => {
    if (!currentUser) {
      throw new Error("No user logged in");
    }

    const updatesWithSport = {
      ...updates,
      sport: updates.sport || currentSport,
    };

    return expensesAPI.updateExpense(currentUser.uid, expenseId, updatesWithSport);
  };

  const deleteExpense = async (expenseId) => {
    if (!currentUser) {
      throw new Error("No user logged in");
    }

    return expensesAPI.deleteExpense(currentUser.uid, expenseId);
  };

  const createPayment = async (paymentData) => {
    if (!currentUser) {
      throw new Error("No user logged in");
    }

    const paymentWithTeam = {
      ...paymentData,
      teamId: paymentData.teamId || currentTeam?.id || null,
    };

    return paymentsAPI.createPayment(currentUser.uid, paymentWithTeam);
  };

  const updatePayment = async (paymentId, updates) => {
    if (!currentUser) {
      throw new Error("No user logged in");
    }

    return paymentsAPI.updatePayment(currentUser.uid, paymentId, updates);
  };

  const deletePayment = async (paymentId) => {
    if (!currentUser) {
      throw new Error("No user logged in");
    }

    return paymentsAPI.deletePayment(currentUser.uid, paymentId);
  };

  const value = {
    teams,
    players,
    expenses,
    payments,

    allPlayers,
    allExpenses,
    allPayments,

    currentTeam,
    currentSport,
    loading,

    setCurrentTeam: handleSetCurrentTeam,
    setCurrentSport: handleSetCurrentSport,

    createTeam,
    updateTeam,
    deleteTeam,

    createPlayer,
    updatePlayer,
    deletePlayer,

    createExpense,
    updateExpense,
    deleteExpense,

    createPayment,
    updatePayment,
    deletePayment,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}