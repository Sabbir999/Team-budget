import React, { useEffect, useState } from "react";
import { useData } from "../../../../contexts/DataContext";
import Modal from "../../../../components/common/Modal.jsx";
import { EXPENSE_CATEGORIES, MONTHS } from "../../utils/constants.js";

export default function ExpenseForm({ expense, onClose }) {
  const { createExpense, updateExpense, currentTeam } = useData();
  const [loading, setLoading] = useState(false);
  const currentYear = new Date().getFullYear();
  const currentMonth = MONTHS[new Date().getMonth()];

  const [form, setForm] = useState({
    title: "",
    category: "other",
    amount: "",
    month: currentMonth,
    year: currentYear,
    teamId: currentTeam?.id || "",
    membersCount: currentTeam?.members?.length || 0,
    paidBy: "",
    notes: "",
  });

  useEffect(() => {
    if (expense) {
      setForm({
        title: expense.title || "",
        category: expense.category || "other",
        amount: expense.amount ?? expense.total ?? "",
        month: expense.month || currentMonth,
        year: expense.year || currentYear,
        teamId: expense.teamId || currentTeam?.id || "",
        membersCount: expense.membersCount ?? expense.playersCount ?? currentTeam?.members?.length ?? 0,
        paidBy: expense.paidBy || "",
        notes: expense.notes || "",
      });
      return;
    }

    setForm((previous) => ({
      ...previous,
      teamId: currentTeam?.id || "",
      membersCount: currentTeam?.members?.length || 0,
    }));
  }, [expense, currentTeam, currentMonth, currentYear]);

  const updateField = (name, value) => {
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!currentTeam) {
      alert("Please select a team first");
      return;
    }

    const amount = Number(form.amount);
    if (!amount || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    setLoading(true);

    try {
      const membersCount = Number(form.membersCount) || 0;
      const expenseData = {
        ...form,
        amount,
        total: amount,
        teamId: currentTeam.id,
        membersCount,
        playersCount: membersCount,
        perPerson: membersCount > 0 ? Math.round((amount / membersCount) * 100) / 100 : 0,
        monthYear: `${form.month}_${form.year}`,
      };

      if (expense) {
        await updateExpense(expense.id, expenseData);
      } else {
        await createExpense(expenseData);
      }

      onClose();
    } catch (error) {
      console.error("Error saving expense:", error);
      alert("Failed to save expense: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={expense ? "Edit Expense" : "Add Expense"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title *</label>
          <input value={form.title} onChange={(event) => updateField("title", event.target.value)} className="input-field mt-1" placeholder="Venue fee, jersey, tournament fee" required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Category *</label>
            <select value={form.category} onChange={(event) => updateField("category", event.target.value)} className="input-field mt-1" required>
              {EXPENSE_CATEGORIES.map((category) => (
                <option key={category.key} value={category.key}>{category.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount *</label>
            <input type="number" min="0.01" step="0.01" value={form.amount} onChange={(event) => updateField("amount", event.target.value)} className="input-field mt-1" placeholder="0.00" required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Month *</label>
            <select value={form.month} onChange={(event) => updateField("month", event.target.value)} className="input-field mt-1" required>
              {MONTHS.map((month) => <option key={month} value={month}>{month}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Year *</label>
            <input type="number" min="2020" max="2035" value={form.year} onChange={(event) => updateField("year", event.target.value)} className="input-field mt-1" required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Members count</label>
            <input type="number" min="0" value={form.membersCount} onChange={(event) => updateField("membersCount", event.target.value)} className="input-field mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Paid by</label>
            <input value={form.paidBy} onChange={(event) => updateField("paidBy", event.target.value)} className="input-field mt-1" placeholder="Optional" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea value={form.notes} onChange={(event) => updateField("notes", event.target.value)} className="input-field mt-1" rows={3} placeholder="Optional notes" />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={loading} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60">
            {loading ? "Saving..." : expense ? "Update Expense" : "Add Expense"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
