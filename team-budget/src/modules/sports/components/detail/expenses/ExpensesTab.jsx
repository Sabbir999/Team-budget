import React, { useMemo, useState } from "react";
import { AlertTriangle, Pencil } from "lucide-react";

import {
  getCategoryByKey,
  getCategoryColor,
  getTripCategories,
} from "../../../utils/tripCategories";

import { formatMoney } from "../../../utils/tripMoney";

function getMemberName(members, personId) {
  return (
    members.find((member) => member.personId === personId)?.name || "Unknown"
  );
}

export default function ExpensesTab({
  team,
  expenses,
  invalidSplitExpenses = [],
  members,
  onEditExpense,
}) {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  const categories = getTripCategories(team);
  const invalidIds = new Set(invalidSplitExpenses.map((expense) => expense.id));

  const filteredExpenses = useMemo(() => {
    const list =
      categoryFilter === "all"
        ? expenses
        : expenses.filter((expense) => expense.category === categoryFilter);

    return [...list].sort((a, b) => {
      if (sortBy === "amount") {
        return (Number(b.amount) || 0) - (Number(a.amount) || 0);
      }

      return new Date(b.date || 0) - new Date(a.date || 0);
    });
  }, [expenses, categoryFilter, sortBy]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="font-bold text-gray-900">
          {filteredExpenses.length} expenses
        </h3>

        <div className="flex gap-2">
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="rounded-xl border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="all">All categories</option>

            {categories.map((category) => (
              <option key={category.id || category.key} value={category.key}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="rounded-xl border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="date">Sort: date</option>
            <option value="amount">Sort: amount</option>
          </select>
        </div>
      </div>

      {invalidSplitExpenses.length > 0 && (
        <div className="mb-4 rounded-xl bg-amber-50 p-3 text-sm font-semibold text-amber-700">
          <AlertTriangle className="mr-2 inline h-4 w-4" />
          {invalidSplitExpenses.length} expense(s) need a payer and at least one
          split member. They are not included in balances yet.
        </div>
      )}

      <div className="divide-y divide-gray-200">
        {filteredExpenses.map((expense) => {
          const category = getCategoryByKey(team, expense.category);
          const color = getCategoryColor(category);
          const invalid = invalidIds.has(expense.id);

          return (
            <div
              key={expense.id}
              className="group flex items-center gap-3 py-4"
            >
              <span className={`h-2.5 w-2.5 rounded-full ${color.dot}`} />

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-bold text-gray-900">
                    {expense.description}
                  </p>

                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-bold ${color.badge}`}
                  >
                    {category.name}
                  </span>

                  {invalid && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
                      Needs fix
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => onEditExpense(expense)}
                    className="hidden rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 group-hover:inline-flex"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </div>

                <p className="text-sm text-gray-500">
                  {expense.date || "No date"} ·{" "}
                  {expense.splitBetween?.length || 0} members · Paid by{" "}
                  {getMemberName(members, expense.paidBy)}
                </p>
              </div>

              <p className="text-right font-bold text-gray-900">
                {formatMoney(expense.amount)}
              </p>
            </div>
          );
        })}

        {filteredExpenses.length === 0 && (
          <div className="py-10 text-center text-sm text-gray-500">
            No expenses yet.
          </div>
        )}
      </div>
    </div>
  );
}
