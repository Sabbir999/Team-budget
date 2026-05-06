import React from "react";
import { X } from "lucide-react";

import {
  formatMoney,
  getMemberPaymentSummary,
  getPartialPaidAmount,
  getRemainingPaymentCapacity,
} from "../../../utils/tripMoney";

export default function PartialPaymentModal({
  member,
  amount,
  note,
  error,
  onAmountChange,
  onNoteChange,
  onCancel,
  onSave,
}) {
  if (!member) {
    return null;
  }

  const payment = getMemberPaymentSummary(member);
  const alreadyPaid = getPartialPaidAmount(member);
  const remaining = getRemainingPaymentCapacity(member);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Record partial payment
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {member.name} fair share is {formatMoney(payment.fairShare)}.
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

        <div className="mb-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-gray-50 p-3">
            <p className="text-xs text-gray-500">Already paid</p>
            <p className="font-bold text-green-600">
              {formatMoney(alreadyPaid)}
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-3">
            <p className="text-xs text-gray-500">Remaining</p>
            <p className="font-bold text-red-600">{formatMoney(remaining)}</p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-gray-700">
              Amount paid
            </span>
            <input
              type="number"
              min="0"
              max={remaining}
              step="0.01"
              value={amount}
              onChange={(event) => onAmountChange(event.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="0.00"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-gray-700">Note</span>
            <input
              value={note}
              onChange={(event) => onNoteChange(event.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="Zelle, cash, Venmo..."
            />
          </label>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSave}
            className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Save partial
          </button>
        </div>
      </div>
    </div>
  );
}
