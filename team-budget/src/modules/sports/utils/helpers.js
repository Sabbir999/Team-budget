// src/modules/sports/utils/helpers.js

export function calculatePlayerBalance(playerId, expenses = [], payments = []) {
  let totalDue = 0;
  let totalPaid = 0;

  expenses.forEach((expense) => {
    const total = Number(expense.total) || 0;
    const playersCount = Number(expense.playersCount) || 0;

    if (playersCount > 0) {
      totalDue += total / playersCount;
    }
  });

  payments.forEach((payment) => {
    if (payment.playerId === playerId) {
      const status = (payment.status || "").toString().toLowerCase();

      if (status === "paid" || status === "completed" || status === "confirmed") {
        totalPaid += Number(payment.amount) || 0;
      }
    }
  });

  const balance = totalPaid - totalDue;

  return {
    totalDue: Math.round(totalDue * 100) / 100,
    totalPaid: Math.round(totalPaid * 100) / 100,
    balance: Math.round(balance * 100) / 100,
    status: balance >= 0 ? "paid" : "unpaid",
  };
}

export function calculateTeamFinancials(expenses = [], payments = []) {
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + (Number(expense.total) || 0),
    0
  );

  const totalCollected = payments.reduce((sum, payment) => {
    const status = (payment.status || "").toString().toLowerCase();

    if (status === "paid" || status === "completed" || status === "confirmed") {
      return sum + (Number(payment.amount) || 0);
    }

    return sum;
  }, 0);

  const outstanding = totalExpenses - totalCollected;
  const collectionRate =
    totalExpenses > 0 ? (totalCollected / totalExpenses) * 100 : 0;

  return {
    totalExpenses: Math.round(totalExpenses * 100) / 100,
    totalCollected: Math.round(totalCollected * 100) / 100,
    outstanding: Math.round(outstanding * 100) / 100,
    collectionRate: Math.round(collectionRate * 100) / 100,
  };
}

export function filterExpensesByPeriod(expenses = [], month, year) {
  return expenses.filter(
    (expense) => expense.month === month && String(expense.year) === String(year)
  );
}

export function filterPaymentsByPeriod(payments = [], month, year) {
  return payments.filter(
    (payment) => payment.month === month && String(payment.year) === String(year)
  );
}

export function getPlayerName(players = [], playerId) {
  const player = players.find((item) => item.id === playerId);

  return player ? player.name : "Unknown Player";
}