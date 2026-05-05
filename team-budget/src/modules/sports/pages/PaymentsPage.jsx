import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search, X } from "lucide-react";

import { useAuth } from "../../../contexts/AuthContext.jsx";
import { useData } from "../../../contexts/DataContext";
import { peopleAPI } from "../../people/api/peopleAPI.js";
import { getPeopleMap, snapshotToArray } from "../../people/utils/peopleHelpers.js";
import PaymentForm from "../components/payments/PaymentForm";
import PaymentTable from "../components/payments/PaymentTable";

export default function PaymentsPage() {
  const { currentUser } = useAuth();
  const { payments, currentTeam } = useData();
  const [people, setPeople] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [monthFilter, setMonthFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (!currentUser?.uid) {
      return undefined;
    }

    const unsubscribe = peopleAPI.getPeople(currentUser.uid, (snapshot) => {
      setPeople(snapshotToArray(snapshot));
    });

    return () => unsubscribe();
  }, [currentUser?.uid]);

  const peopleMap = useMemo(() => getPeopleMap(people), [people]);

  const teamPayments = useMemo(() => {
    if (!currentTeam) {
      return [];
    }

    return payments.filter((payment) => payment.teamId === currentTeam.id);
  }, [payments, currentTeam]);

  const { months, statuses } = useMemo(() => ({
    months: ["all", ...new Set(teamPayments.map((payment) => payment.month).filter(Boolean))],
    statuses: ["all", ...new Set(teamPayments.map((payment) => payment.status).filter(Boolean))],
  }), [teamPayments]);

  const filteredPayments = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return teamPayments.filter((payment) => {
      const person = peopleMap[payment.personId || payment.playerId];
      const matchesSearch =
        !term ||
        [person?.name, payment.month, payment.notes, payment.paymentMethod]
          .filter(Boolean)
          .some((value) => value.toString().toLowerCase().includes(term));
      const matchesMonth = monthFilter === "all" || payment.month === monthFilter;
      const matchesStatus = statusFilter === "all" || payment.status === statusFilter;

      return matchesSearch && matchesMonth && matchesStatus;
    });
  }, [teamPayments, peopleMap, searchTerm, monthFilter, statusFilter]);

  const clearAllFilters = () => {
    setSearchTerm("");
    setMonthFilter("all");
    setStatusFilter("all");
  };

  const handleEdit = (payment) => {
    setEditingPayment(payment);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPayment(null);
  };

  if (!currentTeam) {
    return (
      <div className="py-12 text-center">
        <Plus className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">No team selected</h3>
        <p className="mt-2 text-sm text-gray-500">Please select or create a team to manage payments.</p>
      </div>
    );
  }

  const hasActiveFilters = searchTerm || monthFilter !== "all" || statusFilter !== "all";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
          <p className="mt-2 text-gray-600">Track and manage payments for {currentTeam.name}</p>
        </div>
        <button onClick={() => setShowForm(true)} className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm hover:bg-blue-700">
          <Plus className="mr-2 h-5 w-5" />
          Record Payment
        </button>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Search by member name, month, or notes..." />
          </div>
          <select value={monthFilter} onChange={(event) => setMonthFilter(event.target.value)} className="rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200">
            <option value="all">All Months</option>
            {months.filter((month) => month !== "all").map((month) => <option key={month} value={month}>{month}</option>)}
          </select>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200">
            <option value="all">All Statuses</option>
            {statuses.filter((status) => status !== "all").map((status) => <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>)}
          </select>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>Showing {filteredPayments.length} of {teamPayments.length} payment records</span>
          {hasActiveFilters && (
            <button onClick={clearAllFilters} className="inline-flex items-center font-medium text-blue-600 hover:text-blue-700">
              <X className="mr-1 h-4 w-4" />
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {filteredPayments.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center shadow-sm">
          <Plus className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-2xl font-bold text-gray-900">{teamPayments.length === 0 ? "No payments recorded yet" : "No payments found"}</h3>
          <p className="mx-auto mt-2 max-w-md text-gray-600">Start tracking member payments like monthly dues, team fees, or reimbursements.</p>
          <button onClick={() => setShowForm(true)} className="mt-6 rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700">Record Your First Payment</button>
        </div>
      ) : (
        <PaymentTable payments={filteredPayments} peopleMap={peopleMap} onEdit={handleEdit} />
      )}

      {showForm && <PaymentForm payment={editingPayment} peopleMap={peopleMap} onClose={handleCloseForm} />}
    </div>
  );
}
