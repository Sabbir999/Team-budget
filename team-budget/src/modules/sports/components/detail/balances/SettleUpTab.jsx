import React from "react";
import { ArrowRight } from "lucide-react";

import PersonAvatar from "../../../../people/components/PersonAvatar";
import { formatMoney } from "../../../utils/tripMoney";

export default function SettleUpTab({
  suggestedPayments = [],
  onRecordPayment,
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-bold text-gray-900">Suggested payments</h3>
        <p className="text-sm font-medium text-gray-500">
          Remaining payments needed
        </p>
      </div>

      <div className="divide-y divide-gray-200">
        {suggestedPayments.map((payment) => (
          <div
            key={`${payment.fromPersonId}-${payment.toPersonId}-${payment.amount}`}
            className="flex items-center gap-3 py-4"
          >
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <PersonAvatar person={{ name: payment.fromName }} />

              <span className="font-bold text-gray-900">
                {payment.fromName}
              </span>

              <ArrowRight className="h-4 w-4 text-gray-400" />

              <PersonAvatar person={{ name: payment.toName }} />

              <span className="font-bold text-gray-900">{payment.toName}</span>
            </div>

            <p className="font-bold text-gray-900">
              {formatMoney(payment.amount)}
            </p>

            <button
              type="button"
              onClick={() => onRecordPayment(payment)}
              className="rounded-xl border border-blue-200 px-3 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50"
            >
              Record payment
            </button>
          </div>
        ))}

        {suggestedPayments.length === 0 && (
          <div className="py-10 text-center text-sm text-gray-500">
            Everyone is settled up.
          </div>
        )}
      </div>
    </div>
  );
}
