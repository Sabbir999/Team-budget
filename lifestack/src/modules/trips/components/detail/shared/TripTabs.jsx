import React from "react";

const tabs = [
  ["expenses", "Expenses"],
  ["balances", "Balances"],
  ["payments", "Payments"],
  ["settle", "Settle up"],
  ["categories", "Category breakdown"],
  ["members", "Members"],
];

export default function TripTabs({ activeTab, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 rounded-2xl bg-gray-100 p-2">
      {tabs.map(([key, label]) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={`rounded-xl px-4 py-2 text-sm font-bold ${
            activeTab === key
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
