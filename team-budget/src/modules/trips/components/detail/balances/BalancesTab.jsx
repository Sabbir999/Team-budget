import React from "react";

import PersonAvatar from "../../../../people/components/PersonAvatar";
import { formatMoney } from "../../../utils/tripMoney";

export default function BalancesTab({ memberSummary }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 font-bold text-gray-900">Who paid what</h3>

      <div className="divide-y divide-gray-200">
        {memberSummary.map((member) => (
          <div
            key={member.personId || member.id}
            className="flex items-center gap-3 py-3"
          >
            <PersonAvatar person={member.globalProfile || member} />

            <div className="min-w-0 flex-1">
              <p className="font-bold text-gray-900">{member.name}</p>

              <p className="text-sm text-gray-500">
                Paid for expenses {formatMoney(member.paid)} · Share{" "}
                {formatMoney(member.share)}
              </p>
            </div>

            <p
              className={`font-bold ${
                member.net > 0
                  ? "text-green-600"
                  : member.net < 0
                  ? "text-red-600"
                  : "text-gray-500"
              }`}
            >
              {member.net > 0 ? "+" : ""}
              {formatMoney(member.net)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
