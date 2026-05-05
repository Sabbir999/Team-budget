import React, { useState } from "react";

import { useAuth } from "../../../../contexts/AuthContext.jsx";

import ExpenseModal from "../ExpenseModal.jsx";
import CategoryManagerModal from "../CategoryManagerModal.jsx";
import useTeamDetail from "../../hooks/useTeamDetail";

import FinancialOverview from "../dashboard/FinancialOverview.jsx";
import TeamHero from "./shared/TeamHero";
import TeamMembersBar from "./shared/TeamMembersBar";
import TeamTabs from "./shared/TeamTabs";

import ExpensesTab from "./expenses/ExpensesTab";
import BalancesTab from "./balances/BalancesTab";
import SettleUpTab from "./balances/SettleUpTab";
import CategoryBreakdownTab from "./categories/CategoryBreakdownTab";
import PaymentsTab from "./payments/PaymentsTab";
import RecordPaymentModal from "./payments/RecordPaymentModal";
import MembersTab from "./members/MembersTab";
import TeamMemberDetail from "./members/TeamMemberDetail";

export default function TeamDetail({ team, onBack, onEditTeam }) {
  const { currentUser } = useAuth();

  const {
    expenses,
    invalidSplitExpenses,
    teamPayments,
    members,
    memberBalances,
    suggestedPayments,
    categoryTotals,
    recordPayment,
    deletePayment,
    removeMemberFromTeam,
  } = useTeamDetail({ team, currentUser });

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
    const result = await removeMemberFromTeam(member);

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

        <TeamMemberDetail
          member={latestMember}
          expenses={expenses}
          payments={teamPayments}
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
      <TeamHero
        team={team}
        onBack={onBack}
        onEditTeam={onEditTeam}
        onAddExpense={() => setExpenseModalOpen(true)}
      />

      <FinancialOverview expenses={expenses} payments={teamPayments} />

      {memberActionError && (
        <div className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-600">
          {memberActionError}
        </div>
      )}

      <TeamMembersBar
        team={team}
        members={members}
        onEditTeam={onEditTeam}
        onSelectMember={(member) => {
          setMemberActionError("");
          const latestMember =
            memberBalances.find((item) => item.personId === member.personId) ||
            member;
          setSelectedMember(latestMember);
        }}
        onRemoveMember={handleRemoveMember}
      />

      <TeamTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "expenses" && (
        <ExpensesTab
          team={team}
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
          payments={teamPayments}
          members={members}
          onAddPayment={() => openRecordPaymentModal()}
          onDeletePayment={deletePayment}
        />
      )}

      {activeTab === "categories" && (
        <CategoryBreakdownTab team={team} categoryTotals={categoryTotals} />
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
          team={team}
          members={members}
          expense={editingExpense}
          onClose={closeExpenseModal}
          onManageCategories={() => setCategoryManagerOpen(true)}
        />
      )}

      {categoryManagerOpen && (
        <CategoryManagerModal
          team={team}
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
