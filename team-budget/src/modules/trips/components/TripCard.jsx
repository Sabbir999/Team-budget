import React from "react";
import { Calendar, MapPin, Users, DollarSign } from "lucide-react";

const formatMoney = (amount) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    Number(amount) || 0
  );

function getTripStatus(trip) {
  const now = new Date();
  const start = trip.dateFrom ? new Date(trip.dateFrom) : null;
  const end = trip.dateTo ? new Date(trip.dateTo) : null;

  if (end && end < now) {
    return { label: "Done", className: "bg-green-100 text-green-700" };
  }

  if (start && start > now) {
    return { label: "Upcoming", className: "bg-blue-100 text-blue-700" };
  }

  return { label: "Active", className: "bg-amber-100 text-amber-700" };
}

export default function TripCard({
  trip,
  totalExpenses = 0,
  memberCount = 0,
  onOpen,
  onEdit,
  onDelete,
}) {
  const status = getTripStatus(trip);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{trip.name}</h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
            <MapPin className="h-4 w-4" />
            {trip.destination || "No destination"}
          </p>
          <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            {trip.dateFrom || "No date"}
            {trip.dateTo ? ` – ${trip.dateTo}` : ""}
          </p>
        </div>

        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}>
          {status.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-gray-50 p-3">
          <p className="flex items-center gap-1 text-xs font-medium text-gray-500">
            <DollarSign className="h-3.5 w-3.5" />
            Spent
          </p>
          <p className="mt-1 text-lg font-bold text-gray-900">
            {formatMoney(totalExpenses)}
          </p>
        </div>

        <div className="rounded-xl bg-gray-50 p-3">
          <p className="flex items-center gap-1 text-xs font-medium text-gray-500">
            <Users className="h-3.5 w-3.5" />
            Members
          </p>
          <p className="mt-1 text-lg font-bold text-gray-900">{memberCount}</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => onOpen(trip)}
          className="col-span-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Open
        </button>

        <button
          type="button"
          onClick={() => onEdit(trip)}
          className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Edit
        </button>
      </div>

      {onDelete && (
        <button
          type="button"
          onClick={() => onDelete(trip)}
          className="mt-3 text-xs font-medium text-red-500 hover:text-red-600"
        >
          Delete trip
        </button>
      )}
    </div>
  );
}
