import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

import { formatMoney } from "../../../utils/tripMoney";

export default function RecordPaymentModal({
  members = [],
  initialPayment = null,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState({
    fromPersonId: "",
    toPersonId: "",
    amount: "",
    note: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (!initialPayment) {
      return;
    }

    setForm({
      fromPersonId: initialPayment.fromPersonId || "",
      toPersonId: initialPayment.toPersonId || "",
      amount: initialPayment.amount || "",
      note: initialPayment.note || "",
    });
  }, [initialPayment]);

  const updateField = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const result = await onSave(form);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Record payment</h2>
            <p className="mt-1 text-sm text-gray-500">
              Track real money sent between trip members.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-gray-700">From</span>
            <select
              value={form.fromPersonId}
              onChange={(event) =>
                updateField("fromPersonId", event.target.value)
              }
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5"
            >
              <option value="">Select person</option>
              {members.map((member) => (
                <option key={member.personId} value={member.personId}>
                  {member.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-gray-700">To</span>
            <select
              value={form.toPersonId}
              onChange={(event) => updateField("toPersonId", event.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5"
            >
              <option value="">Select person</option>
              {members.map((member) => (
                <option key={member.personId} value={member.personId}>
                  {member.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-gray-700">Amount</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={(event) => updateField("amount", event.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5"
              placeholder="0.00"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-gray-700">Note</span>
            <input
              value={form.note}
              onChange={(event) => updateField("note", event.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5"
              placeholder="Airbnb share, Zelle, cash..."
            />
          </label>
        </div>

        <div className="mt-5 rounded-xl bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700">
          Recording: {formatMoney(form.amount)}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Save payment
          </button>
        </div>
      </form>
    </div>
  );
}
