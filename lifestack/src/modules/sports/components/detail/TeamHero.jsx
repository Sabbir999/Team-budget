import React from "react";
import { ArrowLeft, Plus } from "lucide-react";

export default function TeamHero({ team, onBack, onEditTeam, onAddExpense }) {
  const subtitle = [team.location, team.season ? `${team.season} Season` : ""]
    .filter(Boolean)
    .join(" • ");

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
      >
        <ArrowLeft className="mr-1 inline h-4 w-4" />
        Back to sports
      </button>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{team.name}</h1>
          {subtitle && <p className="mt-1 text-gray-600">{subtitle}</p>}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => onEditTeam(team)}
            className="rounded-xl border border-gray-300 px-5 py-2.5 font-bold text-gray-700 hover:bg-gray-50"
          >
            Edit team
          </button>

          <button
            type="button"
            onClick={onAddExpense}
            className="rounded-xl bg-blue-600 px-5 py-2.5 font-bold text-white shadow-sm hover:bg-blue-700"
          >
            <Plus className="mr-2 inline h-5 w-5" />
            Add expense
          </button>
        </div>
      </div>
    </div>
  );
}
