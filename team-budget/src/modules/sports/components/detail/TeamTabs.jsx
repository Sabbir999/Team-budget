import React from "react";

const tabs = [
  { key: "expenses", label: "Expenses" },
  { key: "balances", label: "Balances" },
  { key: "payments", label: "Payments" },
  { key: "settle", label: "Settle up" },
  { key: "categories", label: "Category breakdown" },
  { key: "members", label: "Members" },
];

export default function TeamTabs({ activeTab, onChange }) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-gray-100 p-2">
      <div className="flex min-w-max gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${
              activeTab === tab.key
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-700 hover:bg-white/70"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
