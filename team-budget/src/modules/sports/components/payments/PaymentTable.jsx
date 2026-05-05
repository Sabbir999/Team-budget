import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import { useData } from "../../../../contexts/DataContext";

export default function PaymentTable({ payments, peopleMap = {}, onEdit }) {
  const { deletePayment } = useData();

  const handleDelete = async (payment) => {
    if (!window.confirm(`Delete payment for ${payment.month} ${payment.year}?`)) {
      return;
    }

    try {
      await deletePayment(payment.id);
    } catch (error) {
      console.error("Error deleting payment:", error);
      alert("Failed to delete payment: " + error.message);
    }
  };

  const totals = payments.reduce((acc, payment) => {
    const amount = Number(payment.amount) || 0;
    acc.total += amount;
    acc[payment.status] = (acc[payment.status] || 0) + amount;
    return acc;
  }, { total: 0, paid: 0, pending: 0, partial: 0, unpaid: 0 });

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Member</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Period</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Amount</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Method</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {payments.map((payment) => {
              const person = peopleMap[payment.personId || payment.playerId];

              return (
                <tr key={payment.id} className="transition-colors hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900">{person?.name || "Unknown member"}</div>
                    {payment.notes && <div className="mt-1 max-w-xs truncate text-xs text-gray-500">{payment.notes}</div>}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{payment.month} {payment.year}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-blue-600">${Number(payment.amount || 0).toFixed(2)}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm capitalize text-gray-900">{payment.status}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm capitalize text-gray-900">{payment.paymentMethod?.replace("_", " ")}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                    <div className="flex gap-2">
                      <button onClick={() => onEdit(payment)} className="rounded p-1 text-blue-600 hover:bg-blue-50 hover:text-blue-800" title="Edit payment"><Edit2 className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(payment)} className="rounded p-1 text-red-600 hover:bg-red-50 hover:text-red-800" title="Delete payment"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
            <tr className="border-t-2 border-gray-300 bg-gray-50 font-semibold">
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900" colSpan="2">TOTALS</td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">${totals.total.toFixed(2)}</td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900" colSpan="3">
                Paid: ${totals.paid.toFixed(2)} · Pending: ${totals.pending.toFixed(2)} · Partial: ${totals.partial.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
