import React from "react";
import { ArrowLeft, Plus } from "lucide-react";

export default function TeamHero({ team, onBack, onEditTeam, onAddExpense }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="mb-3 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to sports
          </button>

          <h1 className="text-3xl font-bold text-gray-900">{team.name}</h1>

          <p className="text-gray-500">
            {team.location || "No location"}
            {team.season ? ` · ${team.season}` : ""}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onEditTeam?.(team)}
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50"
          >
            Edit team
          </button>

          <button
            type="button"
            onClick={onAddExpense}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
          >
            <Plus className="mr-1 inline h-4 w-4" />
            Add expense
          </button>
        </div>
      </div>
    </div>
  );
}
