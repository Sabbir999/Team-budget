const roundMoney = (value) => Math.round((Number(value) || 0) * 100) / 100;

export function getMemberName(members, personId) {
  return members.find((member) => member.personId === personId)?.name || "Unknown";
}

export function computeTripLedger(expenses = [], payments = [], members = []) {
  const memberMap = new Map();

  members.forEach((member) => {
    memberMap.set(member.personId, {
      ...member,
      paidForGroup: 0,
      shareOfExpenses: 0,
      paidToOthers: 0,
      receivedFromOthers: 0,
      netBalance: 0,
    });
  });

  expenses.forEach((expense) => {
    const amount = Number(expense.amount) || 0;
    const splitBetween = expense.splitBetween || [];
    const paidBy = expense.paidBy;

    if (!amount || !paidBy || splitBetween.length === 0) {
      return;
    }

    if (memberMap.has(paidBy)) {
      const payer = memberMap.get(paidBy);
      payer.paidForGroup = roundMoney(payer.paidForGroup + amount);
    }

    const share = amount / splitBetween.length;

    splitBetween.forEach((personId) => {
      if (!memberMap.has(personId)) {
        return;
      }

      const member = memberMap.get(personId);
      member.shareOfExpenses = roundMoney(member.shareOfExpenses + share);
    });
  });

  payments.forEach((payment) => {
    const amount = Number(payment.amount) || 0;

    if (!amount) {
      return;
    }

    if (memberMap.has(payment.fromPersonId)) {
      const from = memberMap.get(payment.fromPersonId);
      from.paidToOthers = roundMoney(from.paidToOthers + amount);
    }

    if (memberMap.has(payment.toPersonId)) {
      const to = memberMap.get(payment.toPersonId);
      to.receivedFromOthers = roundMoney(to.receivedFromOthers + amount);
    }
  });

  const memberBalances = Array.from(memberMap.values()).map((member) => {
    const netBalance = roundMoney(
      member.paidForGroup -
        member.shareOfExpenses +
        member.paidToOthers -
        member.receivedFromOthers
    );

    return {
      ...member,
      netBalance,
      getsBack: netBalance > 0 ? netBalance : 0,
      owes: netBalance < 0 ? Math.abs(netBalance) : 0,
    };
  });

  const totalSpent = roundMoney(
    expenses.reduce((sum, expense) => sum + (Number(expense.amount) || 0), 0)
  );

  const totalReimbursed = roundMoney(
    payments.reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0)
  );

  const totalShare = roundMoney(
    memberBalances.reduce((sum, member) => sum + member.shareOfExpenses, 0)
  );

  const averageShare =
    memberBalances.length > 0 ? roundMoney(totalShare / memberBalances.length) : 0;

  const openBalance = roundMoney(
    memberBalances.reduce((sum, member) => sum + member.getsBack, 0)
  );

  const peopleStillOweCount = memberBalances.filter((member) => member.owes > 0).length;

  return {
    memberBalances,
    stats: {
      totalSpent,
      averageShare,
      totalReimbursed,
      openBalance,
      peopleStillOweCount,
    },
  };
}

export function computeSuggestedPayments(memberBalances = []) {
  const creditors = memberBalances
    .filter((member) => member.netBalance > 0.01)
    .map((member) => ({
      personId: member.personId,
      name: member.name,
      amount: roundMoney(member.netBalance),
    }));

  const debtors = memberBalances
    .filter((member) => member.netBalance < -0.01)
    .map((member) => ({
      personId: member.personId,
      name: member.name,
      amount: roundMoney(Math.abs(member.netBalance)),
    }));

  const payments = [];
  let creditorIndex = 0;
  let debtorIndex = 0;

  while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
    const creditor = creditors[creditorIndex];
    const debtor = debtors[debtorIndex];
    const amount = roundMoney(Math.min(creditor.amount, debtor.amount));

    if (amount > 0.01) {
      payments.push({
        fromPersonId: debtor.personId,
        fromName: debtor.name,
        toPersonId: creditor.personId,
        toName: creditor.name,
        amount,
      });
    }

    creditor.amount = roundMoney(creditor.amount - amount);
    debtor.amount = roundMoney(debtor.amount - amount);

    if (creditor.amount <= 0.01) {
      creditorIndex += 1;
    }

    if (debtor.amount <= 0.01) {
      debtorIndex += 1;
    }
  }

  return payments;
}
