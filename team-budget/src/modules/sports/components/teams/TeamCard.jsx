import React from "react";
import { Edit2, MapPin, Share2, Trash2, Users } from "lucide-react";

const formatMoney = (amount, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(Number(amount) || 0);

export default function TeamCard({
  team,
  totalExpenses = 0,
  memberCount = 0,
  onOpen,
  onEdit,
  onDelete,
  onShare,
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-xl font-bold text-gray-900">
            {team.name}
          </h3>

          <div className="mt-2 space-y-1 text-sm text-gray-600">
            {team.location && (
              <p className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-gray-500" />
                {team.location}
              </p>
            )}

            {team.season && <p>{team.season} Season</p>}
          </div>
        </div>

        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
          Active
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-gray-50 p-4">
          <p className="text-xs font-medium text-gray-500">Spent</p>
          <p className="mt-1 text-lg font-bold text-gray-900">
            {formatMoney(totalExpenses, team.currency || "USD")}
          </p>
        </div>

        <div className="rounded-xl bg-gray-50 p-4">
          <p className="flex items-center gap-1 text-xs font-medium text-gray-500">
            <Users className="h-3.5 w-3.5" />
            Members
          </p>
          <p className="mt-1 text-lg font-bold text-gray-900">
            {memberCount}
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => onOpen(team)}
          className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
        >
          Open
        </button>

        <button
          type="button"
          onClick={() => onEdit(team)}
          className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50"
        >
          <Edit2 className="mr-1 inline h-4 w-4" />
          Edit
        </button>

        <button
          type="button"
          onClick={() => onShare?.(team)}
          className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50"
        >
          <Share2 className="mr-1 inline h-4 w-4" />
          Share
        </button>
      </div>

      <button
        type="button"
        onClick={() => onDelete(team)}
        className="mt-4 text-sm font-medium text-red-600 hover:text-red-700"
      >
        <Trash2 className="mr-1 inline h-4 w-4" />
        Delete team
      </button>
    </div>
  );
}
