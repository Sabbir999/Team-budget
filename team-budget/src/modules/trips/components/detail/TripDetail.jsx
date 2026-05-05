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

import MembersTab from "./members/MembersTab";
import TripMemberDetail from "./members/TripMemberDetail";
import PartialPaymentModal from "./members/PartialPaymentModal";

export default function TripDetail({ trip, onBack, onEditTrip }) {
  const { currentUser } = useAuth();

  const {
    expenses,
    invalidSplitExpenses,
    members,
    settlements,
    memberSummary,
    categoryTotals,
    stats,
    averageActualShare,
    totalCollected,
    paymentUnsettledAmount,
    peopleStillOweCount,
    updateMemberStatus,
    savePartialPayment,
    removeMemberFromTrip,
  } = useTripDetail({ trip, currentUser });

  const [activeTab, setActiveTab] = useState("expenses");
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [categoryManagerOpen, setCategoryManagerOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberActionError, setMemberActionError] = useState("");

  const [partialPaymentMember, setPartialPaymentMember] = useState(null);
  const [partialPaymentAmount, setPartialPaymentAmount] = useState("");
  const [partialPaymentNote, setPartialPaymentNote] = useState("");
  const [partialPaymentError, setPartialPaymentError] = useState("");

  const openEditExpense = (expense) => {
    setEditingExpense(expense);
    setExpenseModalOpen(true);
  };

  const closeExpenseModal = () => {
    setEditingExpense(null);
    setExpenseModalOpen(false);
  };

  const closePartialPaymentModal = () => {
    setPartialPaymentMember(null);
    setPartialPaymentAmount("");
    setPartialPaymentNote("");
    setPartialPaymentError("");
  };

  const handleSavePartialPayment = async () => {
    const result = await savePartialPayment(
      partialPaymentMember,
      partialPaymentAmount,
      partialPaymentNote
    );

    if (!result.ok) {
      setPartialPaymentError(result.message);
      return;
    }

    closePartialPaymentModal();
  };

  const handleUpdateMemberStatus = async (member, status) => {
    const result = await updateMemberStatus(member, status);

    if (!result.ok) {
      setMemberActionError(result.message);
      return;
    }

    setMemberActionError("");
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
    const latestSummary =
      memberSummary.find(
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
          member={latestSummary}
          expenses={expenses}
          onBack={() => {
            setMemberActionError("");
            setSelectedMember(null);
          }}
          onUpdateStatus={handleUpdateMemberStatus}
          onRemoveMember={handleRemoveMember}
          onOpenPartialPayment={(member) => {
            setPartialPaymentMember(member);
            setPartialPaymentAmount("");
            setPartialPaymentNote("");
            setPartialPaymentError("");
          }}
        />

        <PartialPaymentModal
          member={partialPaymentMember}
          amount={partialPaymentAmount}
          note={partialPaymentNote}
          error={partialPaymentError}
          onAmountChange={setPartialPaymentAmount}
          onNoteChange={setPartialPaymentNote}
          onCancel={closePartialPaymentModal}
          onSave={handleSavePartialPayment}
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

      <TripStatsCards
        stats={stats}
        expenses={expenses}
        members={members}
        averageActualShare={averageActualShare}
        totalCollected={totalCollected}
        paymentUnsettledAmount={paymentUnsettledAmount}
        peopleStillOweCount={peopleStillOweCount}
      />

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
          setSelectedMember(member);
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
        <BalancesTab memberSummary={memberSummary} />
      )}

      {activeTab === "categories" && (
        <CategoryBreakdownTab trip={trip} categoryTotals={categoryTotals} />
      )}

      {activeTab === "settle" && <SettleUpTab settlements={settlements} />}

      {activeTab === "members" && (
        <MembersTab
          memberSummary={memberSummary}
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

      <PartialPaymentModal
        member={partialPaymentMember}
        amount={partialPaymentAmount}
        note={partialPaymentNote}
        error={partialPaymentError}
        onAmountChange={setPartialPaymentAmount}
        onNoteChange={setPartialPaymentNote}
        onCancel={closePartialPaymentModal}
        onSave={handleSavePartialPayment}
      />
    </div>
  );
}