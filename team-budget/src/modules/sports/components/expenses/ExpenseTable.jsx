import React from "react";
import { Edit2, Trash2, Users } from "lucide-react";
import { useData } from "../../../../contexts/DataContext";
import { EXPENSE_CATEGORIES } from "../../utils/constants.js";

const categoryLabel = (key) => EXPENSE_CATEGORIES.find((category) => category.key === key)?.label || key || "Other";

export default function ExpenseTable({ expenses, onEdit }) {
  const { deleteExpense } = useData();

  const handleDelete = async (expense) => {
    if (!window.confirm(`Delete "${expense.title || expense.month}"?`)) {
      return;
    }

    try {
      await deleteExpense(expense.id);
    } catch (error) {
      console.error("Error deleting expense:", error);
      alert("Failed to delete expense: " + error.message);
    }
  };

  const total = expenses.reduce((sum, expense) => sum + Number(expense.total || expense.amount || 0), 0);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Expense</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Category</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Members</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Per person</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Total</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {expenses.map((expense) => (
              <tr key={expense.id} className="transition-colors hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm font-semibold text-gray-900">{expense.title || `${expense.month} ${expense.year}`}</div>
                  <div className="mt-1 max-w-xs truncate text-xs text-gray-500">{expense.month} {expense.year}{expense.notes ? ` · ${expense.notes}` : ""}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{categoryLabel(expense.category)}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  <div className="flex items-center gap-1"><Users className="h-4 w-4 text-gray-400" />{expense.membersCount ?? expense.playersCount ?? 0}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-green-600">${Number(expense.perPerson || 0).toFixed(2)}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-blue-600">${Number(expense.total || expense.amount || 0).toFixed(2)}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                  <div className="flex gap-2">
                    <button onClick={() => onEdit(expense)} className="rounded-lg p-1 text-blue-600 hover:bg-blue-50 hover:text-blue-800" title="Edit expense"><Edit2 className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(expense)} className="rounded-lg p-1 text-red-600 hover:bg-red-50 hover:text-red-800" title="Delete expense"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            <tr className="border-t-2 border-gray-300 bg-gray-50 font-semibold">
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900" colSpan="4">TOTAL</td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-blue-700">${total.toFixed(2)}</td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
