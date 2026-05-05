import { useEffect, useMemo, useState } from "react";

import { tripsAPI } from "../api/tripsAPI";
import { peopleAPI } from "../../people/api/peopleAPI";
import { snapshotToArray } from "../../people/utils/peopleHelpers";

import {
  computeBalances,
  computeSettlements,
  computeMemberSummary,
  computeCategoryTotals,
  getTripStats,
} from "../utils/settlementCalculator";

import { hydrateTripMembers } from "../utils/tripPeople";
import {
  getManualPaidAmount,
  getPaidTowardShare,
  getRemainingPaymentCapacity,
  getStillOwes,
  getPaymentStatusFromAmount,
} from "../utils/tripMoney";

const roundMoney = (value) => Math.round((Number(value) || 0) * 100) / 100;

export default function useTripDetail({ trip, currentUser }) {
  const [expenses, setExpenses] = useState([]);
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

  const balances = useMemo(
    () => computeBalances(validSplitExpenses, members),
    [validSplitExpenses, members]
  );

  const settlements = useMemo(
    () => computeSettlements(balances, members),
    [balances, members]
  );

  const memberSummary = useMemo(
    () => computeMemberSummary(validSplitExpenses, members),
    [validSplitExpenses, members]
  );

  const categoryTotals = useMemo(
    () => computeCategoryTotals(validSplitExpenses),
    [validSplitExpenses]
  );

  const stats = useMemo(
    () => getTripStats(validSplitExpenses, members),
    [validSplitExpenses, members]
  );

  const averageActualShare = useMemo(() => {
    if (memberSummary.length === 0) {
      return 0;
    }

    const totalShare = memberSummary.reduce(
      (sum, member) => sum + (Number(member.share) || 0),
      0
    );

    return roundMoney(totalShare / memberSummary.length);
  }, [memberSummary]);

  const totalCollected = useMemo(
    () =>
      roundMoney(
        memberSummary.reduce(
          (sum, member) => sum + getPaidTowardShare(member),
          0
        )
      ),
    [memberSummary]
  );

  const paymentUnsettledAmount = useMemo(
    () =>
      roundMoney(
        memberSummary.reduce((sum, member) => sum + getStillOwes(member), 0)
      ),
    [memberSummary]
  );

  const peopleStillOweCount = useMemo(
    () => memberSummary.filter((member) => getStillOwes(member) > 0).length,
    [memberSummary]
  );

  const updateExpenseStatus = async (expense, status) => {
    if (!currentUser?.uid) {
      return { ok: false, message: "You must be logged in." };
    }

    await tripsAPI.updateTripExpense(currentUser.uid, trip.id, expense.id, {
      status,
    });

    return { ok: true };
  };

  const updateMemberStatus = async (member, status) => {
    if (!currentUser?.uid || !member?.personId) {
      return { ok: false, message: "Missing member." };
    }

    if (status === "paid") {
      const currentManualPaidAmount = getManualPaidAmount(member);
      const remainingAmount = getRemainingPaymentCapacity(member);

      const finalPaidAmount = roundMoney(
        currentManualPaidAmount + remainingAmount
      );

      await tripsAPI.updateTripMemberStatus(
        currentUser.uid,
        trip.id,
        member.personId,
        "paid",
        {
          paidAmount: finalPaidAmount,
          finalPaymentAmount: remainingAmount,
          note: "Marked paid",
        }
      );

      return { ok: true, status: "paid" };
    }

    if (status === "unpaid") {
      await tripsAPI.updateTripMemberStatus(
        currentUser.uid,
        trip.id,
        member.personId,
        "unpaid"
      );

      return { ok: true, status: "unpaid" };
    }

    return { ok: false, message: "Use the partial payment form." };
  };

  const savePartialPayment = async (member, amount, note = "") => {
    if (!currentUser?.uid || !member?.personId) {
      return { ok: false, message: "Missing member." };
    }

    const paymentAmount = roundMoney(amount);

    if (paymentAmount <= 0) {
      return { ok: false, message: "Enter an amount greater than 0." };
    }

    const remaining = getRemainingPaymentCapacity(member);

    if (paymentAmount > remaining) {
      return {
        ok: false,
        message: "Amount is more than the remaining balance.",
      };
    }

    const previousManualPaidAmount = getManualPaidAmount(member);
    const newManualPaidAmount = roundMoney(
      previousManualPaidAmount + paymentAmount
    );

    const nextStatus = getPaymentStatusFromAmount(member, newManualPaidAmount);

    if (nextStatus === "paid") {
      await tripsAPI.updateTripMemberStatus(
        currentUser.uid,
        trip.id,
        member.personId,
        "paid",
        {
          paidAmount: newManualPaidAmount,
          finalPaymentAmount: paymentAmount,
          note: note || "Marked paid",
        }
      );

      return { ok: true, status: "paid" };
    }

    await tripsAPI.updateTripMemberStatus(
      currentUser.uid,
      trip.id,
      member.personId,
      "partial",
      {
        paidAmount: newManualPaidAmount,
        partialPayment: {
          amount: paymentAmount,
          note,
        },
      }
    );

    return { ok: true, status: "partial" };
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
    people,
    members,
    balances,
    settlements,
    memberSummary,
    categoryTotals,
    stats,
    averageActualShare,
    totalCollected,
    paymentUnsettledAmount,
    peopleStillOweCount,
    updateExpenseStatus,
    updateMemberStatus,
    savePartialPayment,
    removeMemberFromTrip,
  };
}