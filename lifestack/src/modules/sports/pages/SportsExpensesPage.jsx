import React, { useMemo, useState } from "react";
import { Calendar, DollarSign, Home, Plus, Search } from "lucide-react";

import { useData } from "../../../contexts/DataContext";
import ExpenseForm from "../components/expenses/ExpenseForm";
import ExpenseTable from "../components/expenses/ExpenseTable";
import { EXPENSE_CATEGORIES } from "../utils/constants.js";

export default function SportsExpensesPage() {
  const { expenses, currentTeam } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const teamExpenses = useMemo(() => {
    if (!currentTeam) {
      return [];
    }

    return expenses.filter((expense) => expense.teamId === currentTeam.id);
  }, [expenses, currentTeam]);

  const { years, months } = useMemo(() => {
    return {
      years: ["all", ...new Set(teamExpenses.map((expense) => expense.year).filter(Boolean))],
      months: ["all", ...new Set(teamExpenses.map((expense) => expense.month).filter(Boolean))],
    };
  }, [teamExpenses]);

  const filteredExpenses = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return teamExpenses.filter((expense) => {
      const matchesSearch =
        !term ||
        [expense.title, expense.notes, expense.month, expense.paidBy]
          .filter(Boolean)
          .some((value) => value.toString().toLowerCase().includes(term));

      const matchesYear = yearFilter === "all" || String(expense.year) === String(yearFilter);
      const matchesMonth = monthFilter === "all" || expense.month === monthFilter;
      const matchesCategory = categoryFilter === "all" || expense.category === categoryFilter;

      return matchesSearch && matchesYear && matchesMonth && matchesCategory;
    });
  }, [teamExpenses, searchTerm, yearFilter, monthFilter, categoryFilter]);

  const stats = useMemo(() => {
    const totalExpenses = teamExpenses.reduce((sum, expense) => sum + Number(expense.total || expense.amount || 0), 0);
    const venueTotal = teamExpenses
      .filter((expense) => expense.category === "venue")
      .reduce((sum, expense) => sum + Number(expense.total || expense.amount || 0), 0);
    const equipmentTotal = teamExpenses
      .filter((expense) => expense.category === "equipment")
      .reduce((sum, expense) => sum + Number(expense.total || expense.amount || 0), 0);

    return { totalExpenses, venueTotal, equipmentTotal, records: teamExpenses.length };
  }, [teamExpenses]);

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingExpense(null);
  };

  if (!currentTeam) {
    return (
      <div className="py-12 text-center">
        <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">No team selected</h3>
        <p className="mt-2 text-sm text-gray-500">Please select or create a team to manage expenses.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expense Management</h1>
          <p className="mt-2 text-gray-600">Track and manage expenses for {currentTeam.name}</p>
        </div>
        <button onClick={() => setShowForm(true)} className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm hover:bg-blue-700">
          <Plus className="mr-2 h-5 w-5" />
          Add Expense
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4"><div className="rounded-xl bg-blue-50 p-3 text-blue-600"><DollarSign className="h-6 w-6" /></div><div><p className="text-sm font-medium text-gray-600">Total Expenses</p><p className="text-2xl font-bold text-gray-900">${stats.totalExpenses.toFixed(2)}</p></div></div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4"><div className="rounded-xl bg-green-50 p-3 text-green-600"><Home className="h-6 w-6" /></div><div><p className="text-sm font-medium text-gray-600">Venue Costs</p><p className="text-2xl font-bold text-gray-900">${stats.venueTotal.toFixed(2)}</p></div></div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4"><div className="rounded-xl bg-purple-50 p-3 text-purple-600"><DollarSign className="h-6 w-6" /></div><div><p className="text-sm font-medium text-gray-600">Equipment Costs</p><p className="text-2xl font-bold text-gray-900">${stats.equipmentTotal.toFixed(2)}</p></div></div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4"><div className="rounded-xl bg-orange-50 p-3 text-orange-600"><Calendar className="h-6 w-6" /></div><div><p className="text-sm font-medium text-gray-600">Total Records</p><p className="text-2xl font-bold text-gray-900">{stats.records}</p></div></div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <div className="relative lg:col-span-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Search expenses..." />
          </div>
          <select value={yearFilter} onChange={(event) => setYearFilter(event.target.value)} className="rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200">
            <option value="all">All Years</option>
            {years.filter((year) => year !== "all").map((year) => <option key={year} value={year}>{year}</option>)}
          </select>
          <select value={monthFilter} onChange={(event) => setMonthFilter(event.target.value)} className="rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200">
            <option value="all">All Months</option>
            {months.filter((month) => month !== "all").map((month) => <option key={month} value={month}>{month}</option>)}
          </select>
          <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200">
            <option value="all">All Categories</option>
            {EXPENSE_CATEGORIES.map((category) => <option key={category.key} value={category.key}>{category.label}</option>)}
          </select>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>Showing {filteredExpenses.length} of {teamExpenses.length} expense records</span>
          {(searchTerm || yearFilter !== "all" || monthFilter !== "all" || categoryFilter !== "all") && (
            <button onClick={() => { setSearchTerm(""); setYearFilter("all"); setMonthFilter("all"); setCategoryFilter("all"); }} className="font-medium text-blue-600 hover:text-blue-700">Clear all filters</button>
          )}
        </div>
      </div>

      {filteredExpenses.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center shadow-sm">
          <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-2xl font-bold text-gray-900">{teamExpenses.length === 0 ? "No expenses recorded yet" : "No expenses found"}</h3>
          <p className="mx-auto mt-2 max-w-md text-gray-600">Start tracking team expenses like venue, equipment, tournament, uniform, or other costs.</p>
          <button onClick={() => setShowForm(true)} className="mt-6 rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700">Record Your First Expense</button>
        </div>
      ) : (
        <ExpenseTable expenses={filteredExpenses} onEdit={handleEdit} />
      )}

      {showForm && <ExpenseForm expense={editingExpense} onClose={handleCloseForm} />}
    </div>
  );
}
