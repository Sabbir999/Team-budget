import { useEffect, useMemo, useState } from "react";

import { sportsAPI } from "../api/sportsAPI";
import { teamPaymentsAPI } from "../api/teamPaymentsAPI";
import { peopleAPI } from "../../people/api/peopleAPI";
import { snapshotToArray } from "../../people/utils/peopleHelpers";

import {
  computeCategoryTotals,
  getTripStats,
} from "../utils/settlementCalculator";
import { hydrateTripMembers } from "../utils/tripPeople";
import {
  computeSuggestedPayments,
  computeTripLedger,
} from "../utils/tripBalances";

export default function useTeamDetail({ team, currentUser }) {
  const [expenses, setExpenses] = useState([]);
  const [teamPayments, setTeamPayments] = useState([]);
  const [people, setPeople] = useState([]);

  useEffect(() => {
    if (!currentUser?.uid) {
      setPeople([]);
      return undefined;
    }

    const unsubscribe = peopleAPI.getPeople(currentUser.uid, (snapshot) => {
      setPeople(snapshotToArray(snapshot));
    });

    return () => unsubscribe();
  }, [currentUser?.uid]);

  useEffect(() => {
    if (!currentUser?.uid || !team?.id) {
      setExpenses([]);
      return undefined;
    }

    const unsubscribe = sportsAPI.getTeamExpenses(
      currentUser.uid,
      team.id,
      (snapshot) => {
        const data = snapshot.val();

        const list = data
          ? Object.keys(data).map((key) => ({
              ...data[key],
              id: data[key].id || key,
            }))
          : [];

        setExpenses(
          list.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
        );
      }
    );

    return () => unsubscribe();
  }, [currentUser?.uid, team?.id]);

  useEffect(() => {
    if (!currentUser?.uid || !team?.id) {
      setTeamPayments([]);
      return undefined;
    }

    const unsubscribe = teamPaymentsAPI.getTeamPayments(
      currentUser.uid,
      team.id,
      (snapshot) => {
        const data = snapshot.val();

        const list = data
          ? Object.keys(data).map((key) => ({
              ...data[key],
              id: data[key].id || key,
            }))
          : [];

        setTeamPayments(
          list.sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0))
        );
      }
    );

    return () => unsubscribe();
  }, [currentUser?.uid, team?.id]);

  const validSplitExpenses = useMemo(
    () =>
      expenses.filter(
        (expense) =>
          Number(expense.amount) > 0 &&
          Array.isArray(expense.splitBetween) &&
          expense.splitBetween.length > 0 &&
          expense.paidBy
      ),
    [expenses]
  );

  const invalidSplitExpenses = useMemo(
    () => expenses.filter((expense) => !validSplitExpenses.includes(expense)),
    [expenses, validSplitExpenses]
  );

  const members = useMemo(
    () => hydrateTripMembers(team?.members || [], people),
    [team?.members, people]
  );

  const ledger = useMemo(
    () => computeTripLedger(validSplitExpenses, teamPayments, members),
    [validSplitExpenses, teamPayments, members]
  );

  const memberBalances = ledger.memberBalances;

  const suggestedPayments = useMemo(
    () => computeSuggestedPayments(memberBalances),
    [memberBalances]
  );

  const categoryTotals = useMemo(
    () => computeCategoryTotals(validSplitExpenses),
    [validSplitExpenses]
  );

  const legacyStats = useMemo(
    () => getTripStats(validSplitExpenses, members),
    [validSplitExpenses, members]
  );

  const stats = {
    ...legacyStats,
    totalSpent: ledger.stats.totalSpent,
    averageShare: ledger.stats.averageShare,
    totalReimbursed: ledger.stats.totalReimbursed,
    openBalance: ledger.stats.openBalance,
    peopleStillOweCount: ledger.stats.peopleStillOweCount,
  };

  const recordPayment = async ({
    fromPersonId,
    toPersonId,
    amount,
    note = "",
  }) => {
    if (!currentUser?.uid) {
      return { ok: false, message: "You must be logged in." };
    }

    if (!fromPersonId || !toPersonId) {
      return { ok: false, message: "Select both people." };
    }

    if (fromPersonId === toPersonId) {
      return { ok: false, message: "From and To cannot be the same person." };
    }

    if ((Number(amount) || 0) <= 0) {
      return { ok: false, message: "Amount must be greater than 0." };
    }

    await teamPaymentsAPI.createTeamPayment(currentUser.uid, team.id, {
      fromPersonId,
      toPersonId,
      amount: Number(amount) || 0,
      note,
    });

    return { ok: true };
  };

  const deletePayment = async (paymentId) => {
    if (!currentUser?.uid) {
      return { ok: false, message: "You must be logged in." };
    }

    await teamPaymentsAPI.deleteTeamPayment(currentUser.uid, team.id, paymentId);

    return { ok: true };
  };

  const removeMemberFromTeam = async (memberToRemove) => {
    if (!currentUser?.uid) {
      return { ok: false, message: "You must be logged in." };
    }

    const removeId = memberToRemove.personId || memberToRemove.id;

    const paidExpenses = expenses.filter(
      (expense) => expense.paidBy === removeId
    );

    if (paidExpenses.length > 0) {
      return {
        ok: false,
        message:
          "This member paid one or more expenses. Reassign or delete those expenses before removing this member.",
      };
    }

    const hasPayments = teamPayments.some(
      (payment) =>
        payment.fromPersonId === removeId || payment.toPersonId === removeId
    );

    if (hasPayments) {
      return {
        ok: false,
        message:
          "This member has recorded payments. Delete those payments before removing this member.",
      };
    }

    const updatedMembers = (team.members || []).filter((member) => {
      const memberId = member.personId || member.id;
      return memberId !== removeId;
    });

    await sportsAPI.updateTeamMembers(currentUser.uid, team.id, updatedMembers);

    const affectedExpenses = expenses.filter((expense) =>
      expense.splitBetween?.includes(removeId)
    );

    await Promise.all(
      affectedExpenses.map((expense) => {
        const updatedSplitBetween = (expense.splitBetween || []).filter(
          (personId) => personId !== removeId
        );

        return sportsAPI.updateTeamExpense(
          currentUser.uid,
          team.id,
          expense.id,
          {
            splitBetween: updatedSplitBetween,
          }
        );
      })
    );

    return { ok: true };
  };

  return {
    expenses,
    validSplitExpenses,
    invalidSplitExpenses,
    teamPayments,
    people,
    members,
    memberBalances,
    suggestedPayments,
    categoryTotals,
    stats,
    recordPayment,
    deletePayment,
    removeMemberFromTeam,
  };
}
