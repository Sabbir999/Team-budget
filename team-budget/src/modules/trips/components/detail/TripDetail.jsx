import React, { useState } from "react";

import { useAuth } from "../../../../contexts/AuthContext.jsx";

import ExpenseModal from "../ExpenseModal.jsx";
import CategoryManagerModal from "../CategoryManagerModal.jsx";
import useTripDetail from "../../hooks/useTripDetail";

import TripHero from "./shared/TripHero";
import TripStatsCards from "./shared/TripStatsCards";
import TripMembersBar from "./shared/TripMembersBar";
import TripTabs from "./shared/TripTabs";

import ExpensesTab from "./expenses/ExpensesTab";

import BalancesTab from "./balances/BalancesTab";
import SettleUpTab from "./balances/SettleUpTab";

import CategoryBreakdownTab from "./categories/CategoryBreakdownTab";

import PaymentsTab from "./payments/PaymentsTab";
import RecordPaymentModal from "./payments/RecordPaymentModal";

import MembersTab from "./members/MembersTab";
import TripMemberDetail from "./members/TripMemberDetail";

export default function TripDetail({ trip, onBack, onEditTrip }) {
  const { currentUser } = useAuth();

  const {
    expenses,
    invalidSplitExpenses,
    tripPayments,
    members,
    memberBalances,
    suggestedPayments,
    categoryTotals,
    stats,
    recordPayment,
    deletePayment,
    removeMemberFromTrip,
  } = useTripDetail({ trip, currentUser });

  const [activeTab, setActiveTab] = useState("expenses");
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [categoryManagerOpen, setCategoryManagerOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberActionError, setMemberActionError] = useState("");
  const [recordPaymentModalOpen, setRecordPaymentModalOpen] = useState(false);
  const [recordPaymentInitial, setRecordPaymentInitial] = useState(null);

  const openEditExpense = (expense) => {
    setEditingExpense(expense);
    setExpenseModalOpen(true);
  };

  const closeExpenseModal = () => {
    setEditingExpense(null);
    setExpenseModalOpen(false);
  };

  const openRecordPaymentModal = (payment = null) => {
    setRecordPaymentInitial(
      payment
        ? {
            fromPersonId: payment.fromPersonId,
            toPersonId: payment.toPersonId,
            amount: payment.amount,
            note:
              payment.note ||
              `${payment.fromName || "Member"} payment to ${
                payment.toName || "member"
              }`,
          }
        : null
    );

    setRecordPaymentModalOpen(true);
  };

  const closeRecordPaymentModal = () => {
    setRecordPaymentInitial(null);
    setRecordPaymentModalOpen(false);
  };

  const handleRemoveMember = async (member) => {
    const result = await removeMemberFromTrip(member);

    if (!result.ok) {
      setMemberActionError(result.message);
      return;
    }

    setMemberActionError("");
    setSelectedMember(null);
  };

  if (selectedMember) {
    const latestMember =
      memberBalances.find(
        (member) => member.personId === selectedMember.personId
      ) || selectedMember;

    return (
      <>
        {memberActionError && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-600">
            {memberActionError}
          </div>
        )}

        <TripMemberDetail
          member={latestMember}
          expenses={expenses}
          payments={tripPayments}
          members={members}
          onBack={() => {
            setMemberActionError("");
            setSelectedMember(null);
          }}
          onRemoveMember={handleRemoveMember}
        />
      </>
    );
  }

  return (
    <div className="space-y-6">
      <TripHero
        trip={trip}
        onBack={onBack}
        onEditTrip={onEditTrip}
        onAddExpense={() => setExpenseModalOpen(true)}
      />

      <TripStatsCards stats={stats} expenses={expenses} members={members} />

      {memberActionError && (
        <div className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-600">
          {memberActionError}
        </div>
      )}

      <TripMembersBar
        trip={trip}
        members={members}
        onEditTrip={onEditTrip}
        onSelectMember={(member) => {
          setMemberActionError("");
          const latestMember =
            memberBalances.find((item) => item.personId === member.personId) ||
            member;
          setSelectedMember(latestMember);
        }}
        onRemoveMember={handleRemoveMember}
      />

      <TripTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "expenses" && (
        <ExpensesTab
          trip={trip}
          expenses={expenses}
          invalidSplitExpenses={invalidSplitExpenses}
          members={members}
          onEditExpense={openEditExpense}
        />
      )}

      {activeTab === "balances" && (
        <BalancesTab memberBalances={memberBalances} />
      )}

      {activeTab === "payments" && (
        <PaymentsTab
          payments={tripPayments}
          members={members}
          onAddPayment={() => openRecordPaymentModal()}
          onDeletePayment={deletePayment}
        />
      )}

      {activeTab === "categories" && (
        <CategoryBreakdownTab trip={trip} categoryTotals={categoryTotals} />
      )}

      {activeTab === "settle" && (
        <SettleUpTab
          suggestedPayments={suggestedPayments}
          onRecordPayment={openRecordPaymentModal}
        />
      )}

      {activeTab === "members" && (
        <MembersTab
          memberBalances={memberBalances}
          onOpenMember={setSelectedMember}
        />
      )}

      {expenseModalOpen && (
        <ExpenseModal
          trip={trip}
          members={members}
          expense={editingExpense}
          onClose={closeExpenseModal}
          onManageCategories={() => setCategoryManagerOpen(true)}
        />
      )}

      {categoryManagerOpen && (
        <CategoryManagerModal
          trip={trip}
          onClose={() => setCategoryManagerOpen(false)}
        />
      )}

      {recordPaymentModalOpen && (
        <RecordPaymentModal
          members={members}
          initialPayment={recordPaymentInitial}
          onClose={closeRecordPaymentModal}
          onSave={recordPayment}
        />
      )}
    </div>
  );
}
