import React from "react";
import { formatMoney } from "../../../utils/tripMoney";

export default function TripStatsCards({
  stats,
  expenses,
  members,
  averageActualShare,
  totalCollected,
  paymentUnsettledAmount,
  peopleStillOweCount,
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold text-gray-500">Total spent</p>
        <p className="mt-2 text-3xl font-bold text-gray-900">
          {formatMoney(stats.totalSpent)}
        </p>
        <p className="text-sm text-gray-500">
          across {expenses.length} expenses
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold text-gray-500">Average share</p>
        <p className="mt-2 text-3xl font-bold text-gray-900">
          {formatMoney(averageActualShare)}
        </p>
        <p className="text-sm text-gray-500">
          weighted across {members.length} members
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold text-gray-500">Total collected</p>
        <p className="mt-2 text-3xl font-bold text-green-600">
          {formatMoney(totalCollected)}
        </p>
        <p className="text-sm text-gray-500">
          paid toward member shares
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold text-gray-500">Unsettled</p>
        <p className="mt-2 text-3xl font-bold text-red-600">
          {formatMoney(paymentUnsettledAmount)}
        </p>
        <p className="text-sm text-gray-500">
          {peopleStillOweCount} people still owe
        </p>
      </div>
    </div>
  );
}