import React, { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  MapPin,
  Users,
  Mail,
  Phone,
  CircleDollarSign,
} from "lucide-react";
import { useParams } from "react-router-dom";

import { tripSharingAPI } from "../api/tripSharingAPI.js";
import { formatMoney } from "../utils/tripMoney.js";
import {
  computeSuggestedPayments,
  computeTripLedger,
  getMemberName,
} from "../utils/tripBalances.js";

function StatCard({ label, value, note }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      {note && <p className="text-sm text-gray-500">{note}</p>}
    </div>
  );
}

function getInitials(name) {
  if (!name) {
    return "?";
  }

  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function MemberAvatar({ member }) {
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
      {getInitials(member.name)}
    </div>
  );
}

function getMemberExpenses(expenses, personId) {
  return expenses.filter((expense) => {
    const isPayer = expense.paidBy === personId;
    const isInSplit = expense.splitBetween?.includes(personId);

    return isPayer || isInSplit;
  });
}

function getExpenseShare(expense, personId) {
  if (!expense.splitBetween?.includes(personId)) {
    return 0;
  }

  if (!expense.splitBetween?.length) {
    return 0;
  }

  return (Number(expense.amount) || 0) / expense.splitBetween.length;
}

function MemberProfileCard({ member, expenses, payments, members }) {
  const memberExpenses = getMemberExpenses(expenses, member.personId);

  const paymentsMade = payments.filter(
    (payment) => payment.fromPersonId === member.personId
  );

  const paymentsReceived = payments.filter(
    (payment) => payment.toPersonId === member.personId
  );

  const isPositive = member.netBalance > 0;
  const isNegative = member.netBalance < 0;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start gap-3">
        <MemberAvatar member={member} />

        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-gray-900">{member.name}</h3>
          <p className="text-sm text-gray-500">{member.role || "Member"}</p>

          <span
            className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-bold ${
              isPositive
                ? "bg-green-100 text-green-700"
                : isNegative
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {isPositive
              ? `Gets back ${formatMoney(member.netBalance)}`
              : isNegative
              ? `Owes ${formatMoney(Math.abs(member.netBalance))}`
              : "Settled"}
          </span>
        </div>
      </div>

      <div className="mb-5 space-y-2 text-sm text-gray-600">
        <p className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          {member.email || "No email"}
        </p>

        <p className="flex items-center gap-2">
          <Phone className="h-4 w-4" />
          {member.phone || "No phone"}
        </p>

        <p className="flex items-center gap-2">
          <CircleDollarSign className="h-4 w-4" />
          {member.zelle || "No Zelle"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-gray-50 p-3">
          <p className="text-xs text-gray-500">Paid for group</p>
          <p className="font-bold text-blue-600">
            {formatMoney(member.paidForGroup)}
          </p>
        </div>

        <div className="rounded-xl bg-gray-50 p-3">
          <p className="text-xs text-gray-500">Share</p>
          <p className="font-bold text-gray-900">
            {formatMoney(member.shareOfExpenses)}
          </p>
        </div>

        <div className="rounded-xl bg-gray-50 p-3">
          <p className="text-xs text-gray-500">Received</p>
          <p className="font-bold text-green-600">
            {formatMoney(member.receivedFromOthers)}
          </p>
        </div>

        <div className="rounded-xl bg-gray-50 p-3">
          <p className="text-xs text-gray-500">Paid to others</p>
          <p className="font-bold text-purple-600">
            {formatMoney(member.paidToOthers)}
          </p>
        </div>
      </div>

      <div className="mt-5 border-t border-gray-200 pt-4">
        <h4 className="mb-3 font-bold text-gray-900">Expense breakdown</h4>

        <div className="space-y-3">
          {memberExpenses.map((expense) => {
            const isPayer = expense.paidBy === member.personId;
            const isInSplit = expense.splitBetween?.includes(member.personId);
            const share = getExpenseShare(expense, member.personId);

            return (
              <div
                key={expense.id}
                className="rounded-xl border border-gray-200 p-3"
              >
                <div className="flex justify-between gap-3">
                  <div>
                    <p className="font-bold text-gray-900">
                      {expense.description}
                    </p>

                    <p className="text-sm text-gray-500">
                      {expense.date || "No date"} ·{" "}
                      {expense.splitBetween?.length || 0}-way split
                    </p>

                    {isPayer && (
                      <p className="text-sm font-semibold text-blue-600">
                        Paid full expense: {formatMoney(expense.amount)}
                      </p>
                    )}

                    {isInSplit && (
                      <p className="text-sm text-gray-500">
                        This member's share: {formatMoney(share)}
                      </p>
                    )}
                  </div>

                  <p className="font-bold text-gray-900">
                    {isPayer ? formatMoney(expense.amount) : formatMoney(share)}
                  </p>
                </div>
              </div>
            );
          })}

          {memberExpenses.length === 0 && (
            <p className="text-sm text-gray-500">
              This member is not included in any expense yet.
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 border-t border-gray-200 pt-4">
        <h4 className="mb-3 font-bold text-gray-900">Payments received</h4>

        <div className="space-y-2">
          {paymentsReceived.map((payment) => (
            <div
              key={payment.id}
              className="flex justify-between rounded-xl bg-gray-50 p-3"
            >
              <div>
                <p className="font-semibold text-gray-900">
                  {getMemberName(members, payment.fromPersonId)} → {member.name}
                </p>
                <p className="text-sm text-gray-500">
                  {payment.note || "No note"}
                </p>
              </div>

              <p className="font-bold text-green-600">
                {formatMoney(payment.amount)}
              </p>
            </div>
          ))}

          {paymentsReceived.length === 0 && (
            <p className="text-sm text-gray-500">No payments received.</p>
          )}
        </div>
      </div>

      <div className="mt-5 border-t border-gray-200 pt-4">
        <h4 className="mb-3 font-bold text-gray-900">Payments made</h4>

        <div className="space-y-2">
          {paymentsMade.map((payment) => (
            <div
              key={payment.id}
              className="flex justify-between rounded-xl bg-gray-50 p-3"
            >
              <div>
                <p className="font-semibold text-gray-900">
                  {member.name} → {getMemberName(members, payment.toPersonId)}
                </p>
                <p className="text-sm text-gray-500">
                  {payment.note || "No note"}
                </p>
              </div>

              <p className="font-bold text-purple-600">
                {formatMoney(payment.amount)}
              </p>
            </div>
          ))}

          {paymentsMade.length === 0 && (
            <p className="text-sm text-gray-500">No payments made.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SharedTripPage() {
  const { shareId } = useParams();

  const [sharedTrip, setSharedTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadSharedTrip() {
      try {
        const data = await tripSharingAPI.getSharedTrip(shareId);

        if (mounted) {
          setSharedTrip(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || "Shared trip not found.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadSharedTrip();

    return () => {
      mounted = false;
    };
  }, [shareId]);

  const snapshot = sharedTrip?.tripSnapshot || {};
  const trip = snapshot.trip || {};
  const members = snapshot.members || [];
  const expenses = snapshot.expenses || [];
  const payments = snapshot.payments || [];

  const ledger = useMemo(
    () => computeTripLedger(expenses, payments, members),
    [expenses, payments, members]
  );

  const suggestedPayments = useMemo(
    () => computeSuggestedPayments(ledger.memberBalances),
    [ledger.memberBalances]
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl p-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          Loading shared trip...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center font-semibold text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-wide text-blue-600">
              Shared trip · Read only
            </p>

            <h1 className="text-3xl font-bold text-gray-900">
              {trip.name || "Trip"}
            </h1>

            <div className="mt-3 space-y-2 text-gray-600">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {trip.destination || "No destination"}
              </p>

              <p className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {trip.dateFrom || "No start date"}
                {trip.dateTo ? ` – ${trip.dateTo}` : ""}
              </p>

              <p className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {members.length} members
              </p>
            </div>
          </div>

          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">
            {trip.status || "Shared"}
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total spent"
          value={formatMoney(ledger.stats.totalSpent)}
          note={`${expenses.length} expenses`}
        />

        <StatCard
          label="Average share"
          value={formatMoney(ledger.stats.averageShare)}
          note={`${members.length} members`}
        />

        <StatCard
          label="Total reimbursed"
          value={formatMoney(ledger.stats.totalReimbursed)}
          note="real payments recorded"
        />

        <StatCard
          label="Open balance"
          value={formatMoney(ledger.stats.openBalance)}
          note={`${ledger.stats.peopleStillOweCount} people still owe`}
        />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-gray-900">
          Current balances
        </h2>

        <div className="divide-y divide-gray-200">
          {ledger.memberBalances.map((member) => (
            <div
              key={member.personId}
              className="flex items-center justify-between gap-4 py-3"
            >
              <div>
                <p className="font-bold text-gray-900">{member.name}</p>
                <p className="text-sm text-gray-500">
                  Paid for group {formatMoney(member.paidForGroup)} · Share{" "}
                  {formatMoney(member.shareOfExpenses)} · Received{" "}
                  {formatMoney(member.receivedFromOthers)}
                </p>
              </div>

              <p
                className={`font-bold ${
                  member.netBalance > 0
                    ? "text-green-600"
                    : member.netBalance < 0
                    ? "text-red-600"
                    : "text-gray-500"
                }`}
              >
                {member.netBalance > 0
                  ? `Gets back ${formatMoney(member.netBalance)}`
                  : member.netBalance < 0
                  ? `Owes ${formatMoney(Math.abs(member.netBalance))}`
                  : "Settled"}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-gray-900">
          Suggested payments
        </h2>

        <div className="divide-y divide-gray-200">
          {suggestedPayments.map((payment) => (
            <div
              key={`${payment.fromPersonId}-${payment.toPersonId}-${payment.amount}`}
              className="flex items-center justify-between gap-4 py-3"
            >
              <p className="font-bold text-gray-900">
                {payment.fromName} → {payment.toName}
              </p>

              <p className="font-bold text-gray-900">
                {formatMoney(payment.amount)}
              </p>
            </div>
          ))}

          {suggestedPayments.length === 0 && (
            <div className="py-6 text-sm text-gray-500">
              Everyone is settled up.
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-gray-900">
          Member profiles
        </h2>

        <div className="grid gap-5 lg:grid-cols-2">
          {ledger.memberBalances.map((member) => (
            <MemberProfileCard
              key={member.personId}
              member={member}
              expenses={expenses}
              payments={payments}
              members={members}
            />
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-gray-900">Expenses</h2>

        <div className="divide-y divide-gray-200">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between gap-4 py-3"
            >
              <div>
                <p className="font-bold text-gray-900">
                  {expense.description}
                </p>

                <p className="text-sm text-gray-500">
                  {expense.date || "No date"} · Paid by{" "}
                  {getMemberName(members, expense.paidBy)} ·{" "}
                  {expense.splitBetween?.length || 0}-way split
                </p>
              </div>

              <p className="font-bold text-gray-900">
                {formatMoney(expense.amount)}
              </p>
            </div>
          ))}

          {expenses.length === 0 && (
            <div className="py-6 text-sm text-gray-500">
              No expenses shared.
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-gray-900">
          Payments recorded
        </h2>

        <div className="divide-y divide-gray-200">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between gap-4 py-3"
            >
              <div>
                <p className="font-bold text-gray-900">
                  {getMemberName(members, payment.fromPersonId)} →{" "}
                  {getMemberName(members, payment.toPersonId)}
                </p>

                <p className="text-sm text-gray-500">
                  {payment.note || "No note"}
                </p>
              </div>

              <p className="font-bold text-green-600">
                {formatMoney(payment.amount)}
              </p>
            </div>
          ))}

          {payments.length === 0 && (
            <div className="py-6 text-sm text-gray-500">
              No payments recorded.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}