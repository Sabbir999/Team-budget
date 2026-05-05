import { useEffect, useMemo, useState } from "react";

import { tripsAPI } from "../api/tripsAPI";
import { tripPaymentsAPI } from "../api/tripPaymentsAPI";
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

export default function useTripDetail({ trip, currentUser }) {
  const [expenses, setExpenses] = useState([]);
  const [tripPayments, setTripPayments] = useState([]);
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
    if (!currentUser?.uid || !trip?.id) {
      setExpenses([]);
      return undefined;
    }

    const unsubscribe = tripsAPI.getTripExpenses(
      currentUser.uid,
      trip.id,
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
  }, [currentUser?.uid, trip?.id]);

  useEffect(() => {
    if (!currentUser?.uid || !trip?.id) {
      setTripPayments([]);
      return undefined;
    }

    const unsubscribe = tripPaymentsAPI.getTripPayments(
      currentUser.uid,
      trip.id,
      (snapshot) => {
        const data = snapshot.val();

        const list = data
          ? Object.keys(data).map((key) => ({
              ...data[key],
              id: data[key].id || key,
            }))
          : [];

        setTripPayments(
          list.sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0))
        );
      }
    );

    return () => unsubscribe();
  }, [currentUser?.uid, trip?.id]);

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
    () => hydrateTripMembers(trip?.members || [], people),
    [trip?.members, people]
  );

  const ledger = useMemo(
    () => computeTripLedger(validSplitExpenses, tripPayments, members),
    [validSplitExpenses, tripPayments, members]
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

    await tripPaymentsAPI.createTripPayment(currentUser.uid, trip.id, {
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

    await tripPaymentsAPI.deleteTripPayment(currentUser.uid, trip.id, paymentId);

    return { ok: true };
  };

  const removeMemberFromTrip = async (memberToRemove) => {
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

    const hasPayments = tripPayments.some(
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

    const updatedMembers = (trip.members || []).filter((member) => {
      const memberId = member.personId || member.id;
      return memberId !== removeId;
    });

    await tripsAPI.updateTripMembers(currentUser.uid, trip.id, updatedMembers);

    const affectedExpenses = expenses.filter((expense) =>
      expense.splitBetween?.includes(removeId)
    );

    await Promise.all(
      affectedExpenses.map((expense) => {
        const updatedSplitBetween = (expense.splitBetween || []).filter(
          (personId) => personId !== removeId
        );

        return tripsAPI.updateTripExpense(
          currentUser.uid,
          trip.id,
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
    tripPayments,
    people,
    members,
    memberBalances,
    suggestedPayments,
    categoryTotals,
    stats,
    recordPayment,
    deletePayment,
    removeMemberFromTrip,
  };
}
