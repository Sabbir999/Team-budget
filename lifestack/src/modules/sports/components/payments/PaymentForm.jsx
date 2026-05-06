import React, { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { useData } from "../../../../contexts/DataContext";
import Modal from "../../../../components/common/Modal.jsx";
import { MONTHS, PAYMENT_METHODS, PAYMENT_STATUSES } from "../../utils/constants.js";

export default function PaymentForm({ payment, peopleMap = {}, onClose }) {
  const { createPayment, updatePayment, currentTeam, payments } = useData();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const currentYear = new Date().getFullYear();
  const teamMembers = currentTeam?.members || [];

  const [form, setForm] = useState({
    month: MONTHS[new Date().getMonth()],
    year: currentYear,
    personId: "",
    amount: "",
    status: "pending",
    paymentMethod: "zelle",
    notes: "",
    paidAt: null,
  });

  useEffect(() => {
    if (payment) {
      setForm({
        month: payment.month || MONTHS[new Date().getMonth()],
        year: payment.year || currentYear,
        personId: payment.personId || payment.playerId || "",
        amount: payment.amount || "",
        status: payment.status || "pending",
        paymentMethod: payment.paymentMethod || "zelle",
        notes: payment.notes || "",
        paidAt: payment.paidAt || null,
      });
    }
  }, [payment, currentYear]);

  const updateField = (name, value) => {
    if (errors[name] || errors.duplicate) {
      setErrors((previous) => ({ ...previous, [name]: "", duplicate: "" }));
    }

    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.personId) {
      nextErrors.personId = "Please select a member";
    }

    const amount = Number(form.amount);
    if (!amount || amount <= 0) {
      nextErrors.amount = "Please enter a valid amount greater than 0";
    }

    if (!payment) {
      const duplicatePayment = payments.find(
        (item) =>
          (item.personId || item.playerId) === form.personId &&
          item.month === form.month &&
          String(item.year) === String(form.year)
      );

      if (duplicatePayment) {
        const personName = peopleMap[form.personId]?.name || "Member";
        nextErrors.duplicate = `${personName} already has a payment record for ${form.month} ${form.year}`;
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!currentTeam) {
      alert("Please select a team first");
      return;
    }

    setLoading(true);

    try {
      const paymentData = {
        ...form,
        teamId: currentTeam.id,
        personId: form.personId,
        playerId: form.personId,
        amount: Number(form.amount),
        paidAt: form.status === "paid" ? form.paidAt || Date.now() : null,
      };

      if (payment) {
        await updatePayment(payment.id, paymentData);
      } else {
        await createPayment(paymentData);
      }

      onClose();
    } catch (error) {
      console.error("Error saving payment:", error);
      alert("Failed to save payment: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={payment ? "Edit Payment" : "Record Payment"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.duplicate && (
          <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600" />
            <p className="text-sm text-red-800">{errors.duplicate}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Month *</label>
            <select value={form.month} onChange={(event) => updateField("month", event.target.value)} className="input-field" required>
              {MONTHS.map((month) => <option key={month} value={month}>{month}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Year *</label>
            <input type="number" min="2020" max="2035" value={form.year} onChange={(event) => updateField("year", event.target.value)} className="input-field" required />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Member *</label>
          <select value={form.personId} onChange={(event) => updateField("personId", event.target.value)} className={`input-field ${errors.personId ? "border-red-500" : ""}`} required>
            <option value="">Select a member</option>
            {teamMembers.filter((member) => member.isActive !== false).map((member) => {
              const person = peopleMap[member.personId];
              return <option key={member.personId} value={member.personId}>{person?.name || "Unknown person"}</option>;
            })}
          </select>
          {errors.personId && <p className="mt-1 text-sm text-red-500">{errors.personId}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Amount *</label>
          <input type="number" min="0.01" step="0.01" value={form.amount} onChange={(event) => updateField("amount", event.target.value)} className={`input-field ${errors.amount ? "border-red-500" : ""}`} placeholder="0.00" required />
          {errors.amount && <p className="mt-1 text-sm text-red-500">{errors.amount}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Status *</label>
            <select value={form.status} onChange={(event) => updateField("status", event.target.value)} className="input-field" required>
              {PAYMENT_STATUSES.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Payment method *</label>
            <select value={form.paymentMethod} onChange={(event) => updateField("paymentMethod", event.target.value)} className="input-field" required>
              {PAYMENT_METHODS.map((method) => <option key={method.value} value={method.value}>{method.label}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Notes</label>
          <textarea value={form.notes} onChange={(event) => updateField("notes", event.target.value)} className="input-field" rows={3} placeholder="Optional notes" />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={loading} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60">
            {loading ? "Saving..." : payment ? "Update Payment" : "Record Payment"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
