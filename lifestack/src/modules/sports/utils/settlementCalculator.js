const roundMoney = (value) => Math.round((Number(value) || 0) * 100) / 100;
const getAmount = (amount) => Number(amount) || 0;

export function computeBalances(expenses = [], members = []) {
  const balances = {};

  members.forEach((member) => {
    balances[member.personId || member.id] = 0;
  });

  expenses.forEach((expense) => {
    const paidBy = expense.paidBy;
    const amount = getAmount(expense.amount);
    const splitBetween = Array.isArray(expense.splitBetween)
      ? expense.splitBetween
      : [];

    if (!paidBy || amount <= 0 || splitBetween.length === 0) {
      return;
    }

    const share = amount / splitBetween.length;

    if (balances[paidBy] !== undefined) {
      balances[paidBy] += amount;
    }

    splitBetween.forEach((personId) => {
      if (balances[personId] !== undefined) {
        balances[personId] -= share;
      }
    });
  });

  Object.keys(balances).forEach((personId) => {
    balances[personId] = roundMoney(balances[personId]);
  });

  return balances;
}

export function computeSettlements(balances = {}, members = []) {
  const memberMap = {};

  members.forEach((member) => {
    memberMap[member.personId || member.id] = member.name;
  });

  const creditors = [];
  const debtors = [];

  Object.entries(balances).forEach(([personId, balance]) => {
    const roundedBalance = roundMoney(balance);

    if (roundedBalance > 0.01) {
      creditors.push({ id: personId, amount: roundedBalance });
    }

    if (roundedBalance < -0.01) {
      debtors.push({ id: personId, amount: Math.abs(roundedBalance) });
    }
  });

  const transfers = [];
  let creditorIndex = 0;
  let debtorIndex = 0;

  while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
    const creditor = creditors[creditorIndex];
    const debtor = debtors[debtorIndex];
    const transferAmount = roundMoney(Math.min(creditor.amount, debtor.amount));

    if (transferAmount > 0.01) {
      transfers.push({
        from: debtor.id,
        fromName: memberMap[debtor.id] || debtor.id,
        to: creditor.id,
        toName: memberMap[creditor.id] || creditor.id,
        amount: transferAmount,
      });
    }

    creditor.amount = roundMoney(creditor.amount - transferAmount);
    debtor.amount = roundMoney(debtor.amount - transferAmount);

    if (creditor.amount <= 0.01) creditorIndex += 1;
    if (debtor.amount <= 0.01) debtorIndex += 1;
  }

  return transfers;
}

export function computeCategoryTotals(expenses = []) {
  const totals = {};

  expenses.forEach((expense) => {
    const category = expense.category || "other";
    const amount = getAmount(expense.amount);

    totals[category] = roundMoney((totals[category] || 0) + amount);
  });

  return totals;
}

export function computeMemberSummary(expenses = [], members = []) {
  const paid = {};
  const share = {};

  members.forEach((member) => {
    const personId = member.personId || member.id;
    paid[personId] = 0;
    share[personId] = 0;
  });

  expenses.forEach((expense) => {
    const paidBy = expense.paidBy;
    const amount = getAmount(expense.amount);
    const splitBetween = Array.isArray(expense.splitBetween)
      ? expense.splitBetween
      : [];

    if (!paidBy || amount <= 0 || splitBetween.length === 0) {
      return;
    }

    const perPerson = amount / splitBetween.length;

    if (paid[paidBy] !== undefined) {
      paid[paidBy] += amount;
    }

    splitBetween.forEach((personId) => {
      if (share[personId] !== undefined) {
        share[personId] += perPerson;
      }
    });
  });

  return members.map((member) => {
    const personId = member.personId || member.id;

    return {
      ...member,
      id: personId,
      personId,
      paid: roundMoney(paid[personId]),
      share: roundMoney(share[personId]),
      net: roundMoney(paid[personId] - share[personId]),
    };
  });
}

export function getLargestExpense(expenses = []) {
  if (expenses.length === 0) {
    return null;
  }

  return [...expenses].sort(
    (a, b) => (Number(b.amount) || 0) - (Number(a.amount) || 0)
  )[0];
}

export function getTripStats(expenses = [], members = []) {
  const totalSpent = roundMoney(
    expenses.reduce((sum, expense) => sum + getAmount(expense.amount), 0)
  );

  const perPerson = members.length > 0 ? roundMoney(totalSpent / members.length) : 0;
  const largestExpense = getLargestExpense(expenses);
  const balances = computeBalances(expenses, members);
  const settlements = computeSettlements(balances, members);
  const unsettledAmount = roundMoney(
    settlements.reduce((sum, transfer) => sum + transfer.amount, 0)
  );

  return {
    totalSpent,
    perPerson,
    largestExpense,
    unsettledAmount,
    settlementCount: settlements.length,
  };
}
