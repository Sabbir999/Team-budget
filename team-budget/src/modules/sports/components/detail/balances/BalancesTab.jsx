import React from "react";

import PersonAvatar from "../../../../people/components/PersonAvatar";
import { formatMoney } from "../../../utils/tripMoney";

export default function BalancesTab({ memberBalances = [] }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 font-bold text-gray-900">Current balances</h3>

      <div className="divide-y divide-gray-200">
        {memberBalances.map((member) => (
          <div
            key={member.personId || member.id}
            className="flex items-center gap-3 py-3"
          >
            <PersonAvatar person={member.globalProfile || member} />

            <div className="min-w-0 flex-1">
              <p className="font-bold text-gray-900">{member.name}</p>

              <p className="text-sm text-gray-500">
                Paid for group {formatMoney(member.paidForGroup)} · Share{" "}
                {formatMoney(member.shareOfExpenses)} · Received{" "}
                {formatMoney(member.receivedFromOthers)} · Paid out{" "}
                {formatMoney(member.paidToOthers)}
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

        {memberBalances.length === 0 && (
          <div className="py-10 text-center text-sm text-gray-500">
            No balances yet.
          </div>
        )}
      </div>
    </div>
  );
}
