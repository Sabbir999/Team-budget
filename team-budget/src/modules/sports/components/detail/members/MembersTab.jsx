import React from "react";

import PersonAvatar from "../../../../people/components/PersonAvatar";
import { formatMoney } from "../../../utils/tripMoney";

export default function MembersTab({ memberBalances = [], onOpenMember }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="mb-5 font-bold text-gray-900">
        Members · {memberBalances.length}
      </h3>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {memberBalances.map((member) => {
          const isPositive = member.netBalance > 0;
          const isNegative = member.netBalance < 0;

          return (
            <div
              key={member.personId || member.id}
              className={`rounded-2xl border-t-4 bg-gray-50 p-4 ${
                isPositive
                  ? "border-green-400"
                  : isNegative
                  ? "border-red-400"
                  : "border-gray-300"
              }`}
            >
              <div className="mb-4 flex items-center gap-3">
                <PersonAvatar person={member.globalProfile || member} />

                <div>
                  <p className="font-bold text-gray-900">{member.name}</p>
                  <p className="text-sm text-gray-500">
                    {member.role || "Member"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-white p-3">
                  <p className="text-xs text-gray-500">Paid for group</p>
                  <p className="font-bold text-blue-600">
                    {formatMoney(member.paidForGroup)}
                  </p>
                </div>

                <div className="rounded-xl bg-white p-3">
                  <p className="text-xs text-gray-500">
                    {isPositive ? "Gets back" : isNegative ? "Owes" : "Balance"}
                  </p>

                  <p
                    className={
                      isPositive
                        ? "font-bold text-green-600"
                        : isNegative
                        ? "font-bold text-red-600"
                        : "font-bold text-gray-900"
                    }
                  >
                    {isPositive
                      ? formatMoney(member.netBalance)
                      : isNegative
                      ? formatMoney(Math.abs(member.netBalance))
                      : "Settled"}
                  </p>
                </div>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-white p-3">
                  <p className="text-xs text-gray-500">Share</p>
                  <p className="font-bold text-gray-900">
                    {formatMoney(member.shareOfExpenses)}
                  </p>
                </div>

                <div className="rounded-xl bg-white p-3">
                  <p className="text-xs text-gray-500">Received</p>
                  <p className="font-bold text-green-600">
                    {formatMoney(member.receivedFromOthers)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onOpenMember(member)}
                className="mt-3 w-full rounded-xl border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-white"
              >
                View team detail
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
