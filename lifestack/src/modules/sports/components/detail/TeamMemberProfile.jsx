import React from "react";
import { ArrowLeft, Mail, Phone, Trash2 } from "lucide-react";
import PersonAvatar from "../../../people/components/PersonAvatar.jsx";
import { getInitials } from "../../../people/utils/peopleHelpers.js";

const formatMoney = (amount, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(Number(amount) || 0);

export default function TeamMemberProfile({
  member,
  expenses = [],
  payments = [],
  currency = "USD",
  onBack,
  onRemoveMember,
}) {
  const person = member.person || {};
  const name = person.name || "Unknown member";
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + (Number(expense.total ?? expense.amount) || 0),
    0
  );
  const memberCount = Math.max(Number(member.teamMemberCount) || 1, 1);
  const shareWeight = Number(member.shareWeight) || 1;
  const totalWeight = Number(member.totalWeight) || memberCount;
  const memberShare = totalWeight > 0 ? (totalExpenses * shareWeight) / totalWeight : 0;

  const memberPayments = payments.filter(
    (payment) => (payment.personId || payment.playerId) === member.personId
  );
  const collected = memberPayments.reduce((sum, payment) => {
    const status = (payment.status || "").toLowerCase();
    if (["paid", "completed", "confirmed"].includes(status)) {
      return sum + (Number(payment.amount) || 0);
    }
    return sum;
  }, 0);
  const balance = memberShare - collected;

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="text-sm font-semibold text-blue-600 hover:text-blue-700"
      >
        <ArrowLeft className="mr-1 inline h-4 w-4" />
        Back to team
      </button>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <PersonAvatar person={person} initials={getInitials(name)} size="lg" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
              <p className="text-sm text-gray-600">
                {member.role || "Member"}
                {member.position ? ` • ${member.position}` : ""}
                {member.jerseyNumber ? ` • #${member.jerseyNumber}` : ""}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onRemoveMember(member)}
            className="rounded-xl border border-red-200 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50"
          >
            <Trash2 className="mr-1 inline h-4 w-4" />
            Remove member
          </button>
        </div>

        <div className="mt-5 grid gap-3 text-sm text-gray-600 sm:grid-cols-2">
          {person.email && (
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {person.email}
            </p>
          )}
          {person.phone && (
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              {person.phone}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Expense share</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {formatMoney(memberShare, currency)}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Paid</p>
          <p className="mt-1 text-2xl font-bold text-green-600">
            {formatMoney(collected, currency)}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Balance</p>
          <p className={`mt-1 text-2xl font-bold ${balance > 0 ? "text-red-600" : "text-green-600"}`}>
            {formatMoney(Math.abs(balance), currency)}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {balance > 0 ? "Still due" : "Settled / overpaid"}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Payment records</h2>
        {memberPayments.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">No payments recorded for this member yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {memberPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
                <div>
                  <p className="font-semibold text-gray-900">{payment.month} {payment.year}</p>
                  <p className="text-sm capitalize text-gray-500">{payment.status} • {payment.paymentMethod}</p>
                </div>
                <p className="font-bold text-gray-900">{formatMoney(payment.amount, currency)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
