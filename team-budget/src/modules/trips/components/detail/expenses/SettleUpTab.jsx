import React from "react";
import { ArrowRight } from "lucide-react";

import PersonAvatar from "../../../../people/components/PersonAvatar";
import { formatMoney } from "../../../utils/tripMoney";

export default function SettleUpTab({ settlements = [] }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-bold text-gray-900">Transfers to settle up</h3>
        <p className="text-sm font-medium text-gray-500">
          Minimum payments needed
        </p>
      </div>

      <div className="divide-y divide-gray-200">
        {settlements.map((transfer) => (
          <div
            key={`${transfer.from}-${transfer.to}-${transfer.amount}`}
            className="flex items-center gap-3 py-4"
          >
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <PersonAvatar person={{ name: transfer.fromName }} />

              <span className="font-bold text-gray-900">
                {transfer.fromName}
              </span>

              <ArrowRight className="h-4 w-4 text-gray-400" />

              <PersonAvatar person={{ name: transfer.toName }} />

              <span className="font-bold text-gray-900">
                {transfer.toName}
              </span>
            </div>

            <p className="font-bold text-gray-900">
              {formatMoney(transfer.amount)}
            </p>
          </div>
        ))}

        {settlements.length === 0 && (
          <div className="py-10 text-center text-sm text-gray-500">
            Everyone is settled up.
          </div>
        )}
      </div>
    </div>
  );
}