import React from "react";
import { Plus, Trash2 } from "lucide-react";

import { formatMoney } from "../../../utils/tripMoney";
import { getMemberName } from "../../../utils/tripBalances";

export default function PaymentsTab({
  payments = [],
  members = [],
  onAddPayment,
  onDeletePayment,
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-bold text-gray-900">Payments recorded</h3>

        <button
          type="button"
          onClick={onAddPayment}
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
        >
          <Plus className="mr-1 inline h-4 w-4" />
          Record payment
        </button>
      </div>

      <div className="divide-y divide-gray-200">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="flex items-center justify-between gap-3 py-4"
          >
            <div>
              <p className="font-bold text-gray-900">
                {getMemberName(members, payment.fromPersonId)} →{" "}
                {getMemberName(members, payment.toPersonId)}
              </p>

              <p className="text-sm text-gray-500">
                {payment.note || "No note"} ·{" "}
                {payment.createdAt
                  ? new Date(payment.createdAt).toLocaleDateString()
                  : ""}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <p className="font-bold text-green-600">
                {formatMoney(payment.amount)}
              </p>

              <button
                type="button"
                onClick={() => onDeletePayment(payment.id)}
                className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {payments.length === 0 && (
          <div className="py-10 text-center text-sm text-gray-500">
            No payments recorded yet.
          </div>
        )}
      </div>
    </div>
  );
}
