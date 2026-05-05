import React from "react";
import { Mail, Phone, CircleDollarSign } from "lucide-react";

import PersonAvatar from "../../../../people/components/PersonAvatar";
import { formatMoney } from "../../../utils/tripMoney";
import { getMemberName } from "../../../utils/tripBalances";

function getExpenseShare(expense, personId) {
  if (!expense.splitBetween?.includes(personId)) {
    return 0;
  }

  if (!expense.splitBetween?.length) {
    return 0;
  }

  return (Number(expense.amount) || 0) / expense.splitBetween.length;
}

export default function TeamMemberDetail({
  member,
  expenses,
  payments,
  members,
  onBack,
  onRemoveMember,
}) {
  const memberExpenses = expenses.filter((expense) => {
    const isInSplit = expense.splitBetween?.includes(member.personId);
    const isPayer = expense.paidBy === member.personId;

    return isInSplit || isPayer;
  });

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
      <div className="mb-5 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          ← Back to team
        </button>

        <button
          type="button"
          onClick={() => onRemoveMember(member)}
          className="rounded-xl border border-red-200 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50"
        >
          Remove from team
        </button>
      </div>

      <div className="mb-6 flex items-start gap-4">
        <PersonAvatar person={member.globalProfile || member} size="lg" />

        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold text-gray-900">{member.name}</h2>

          <p className="text-gray-500">
            {member.role || "Member"} · This team only
          </p>

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

      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <h3 className="mb-3 font-bold text-gray-900">
            Global contact info
          </h3>

          <div className="space-y-3 text-sm text-gray-600">
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
        </div>

        <div>
          <h3 className="mb-3 font-bold text-gray-900">Team summary</h3>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-gray-50 p-3">
              <p className="text-xs text-gray-500">Paid for group</p>
              <p className="font-bold text-blue-600">
                {formatMoney(member.paidForGroup)}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-3">
              <p className="text-xs text-gray-500">Share of expenses</p>
              <p className="font-bold">
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

            <div className="rounded-xl bg-gray-50 p-3 md:col-span-2">
              <p className="text-xs text-gray-500">Net balance</p>
              <p
                className={`font-bold ${
                  isPositive
                    ? "text-green-600"
                    : isNegative
                    ? "text-red-600"
                    : "text-gray-900"
                }`}
              >
                {isPositive
                  ? `Gets back ${formatMoney(member.netBalance)}`
                  : isNegative
                  ? `Owes ${formatMoney(Math.abs(member.netBalance))}`
                  : "Settled"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-gray-200 pt-5">
        <h3 className="mb-3 font-bold text-gray-900">Payments received</h3>

        <div className="divide-y divide-gray-200 rounded-xl border border-gray-200">
          {paymentsReceived.map((payment) => (
            <div key={payment.id} className="flex justify-between gap-3 p-3">
              <div>
                <p className="font-bold text-gray-900">
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
            <div className="p-3 text-sm text-gray-500">
              No payments received.
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 border-t border-gray-200 pt-5">
        <h3 className="mb-3 font-bold text-gray-900">Payments made</h3>

        <div className="divide-y divide-gray-200 rounded-xl border border-gray-200">
          {paymentsMade.map((payment) => (
            <div key={payment.id} className="flex justify-between gap-3 p-3">
              <div>
                <p className="font-bold text-gray-900">
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
            <div className="p-3 text-sm text-gray-500">No payments made.</div>
          )}
        </div>
      </div>

      <div className="mt-6 border-t border-gray-200 pt-5">
        <h3 className="mb-3 font-bold text-gray-900">Expense breakdown</h3>

        <div className="divide-y divide-gray-200">
          {memberExpenses.map((expense) => {
            const isPayer = expense.paidBy === member.personId;
            const isInSplit = expense.splitBetween?.includes(member.personId);
            const share = getExpenseShare(expense, member.personId);
            const payerGetsBack = Math.max(
              (Number(expense.amount) || 0) - share,
              0
            );

            return (
              <div
                key={expense.id}
                className="flex justify-between gap-3 py-3"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-gray-900">
                      {expense.description}
                    </p>

                    {isPayer && (
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700">
                        Paid by this member
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-500">
                    {expense.date} · {expense.splitBetween?.length || 0}-way
                    split
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

                <div className="text-right">
                  <p className="font-bold text-gray-900">
                    {isPayer ? formatMoney(expense.amount) : formatMoney(share)}
                  </p>

                  {isPayer && (
                    <p className="text-xs text-green-600">
                      Others owe {formatMoney(payerGetsBack)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}

          {memberExpenses.length === 0 && (
            <div className="py-6 text-sm text-gray-500">
              This member is not included in any expense yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
