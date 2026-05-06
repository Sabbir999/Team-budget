import React, { useEffect, useMemo, useState } from "react";
import { Plus, MapPin, Calendar, DollarSign } from "lucide-react";

import { useAuth } from "../../../contexts/AuthContext";
import { tripsAPI } from "../api/tripsAPI";

import TripCard from "../components/TripCard";
import TripForm from "../components/TripForm";
import TripDetail from "../components/detail/TripDetail";
import ShareTripModal from "../components/ShareTripModal";

export default function TripsPage() {
  const { currentUser } = useAuth();

  const [trips, setTrips] = useState([]);
  const [tripExpenseTotals, setTripExpenseTotals] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [openTrip, setOpenTrip] = useState(null);
  const [deletingTrip, setDeletingTrip] = useState(null);
  const [sharingTrip, setSharingTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.uid) {
      setTrips([]);
      setTripExpenseTotals({});
      setLoading(false);
      return undefined;
    }

    setLoading(true);

    const expenseUnsubscribers = [];

    const unsubscribeTrips = tripsAPI.getTrips(currentUser.uid, (snapshot) => {
      const data = snapshot.val();

      const tripList = data
        ? Object.keys(data).map((key) => ({
            ...data[key],
            id: data[key].id || key,
          }))
        : [];

      tripList.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

      setTrips(tripList);
      setLoading(false);

      tripList.forEach((trip) => {
        const unsubscribeExpenses = tripsAPI.getTripExpenses(
          currentUser.uid,
          trip.id,
          (expenseSnapshot) => {
            const expenseData = expenseSnapshot.val();

            const total = expenseData
              ? Object.values(expenseData).reduce(
                  (sum, expense) => sum + (Number(expense.amount) || 0),
                  0
                )
              : 0;

            setTripExpenseTotals((previous) => ({
              ...previous,
              [trip.id]: total,
            }));
          }
        );

        expenseUnsubscribers.push(unsubscribeExpenses);
      });
    });

    return () => {
      unsubscribeTrips();
      expenseUnsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [currentUser?.uid]);

  const handleEdit = (trip) => {
    setEditingTrip(trip);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTrip(null);
  };

  const handleDelete = async () => {
    if (!currentUser?.uid || !deletingTrip) {
      return;
    }

    await tripsAPI.deleteTrip(currentUser.uid, deletingTrip.id);
    setDeletingTrip(null);
  };

  const stats = useMemo(() => {
    const totalTrips = trips.length;

    const totalSpent = Object.values(tripExpenseTotals).reduce(
      (sum, value) => sum + value,
      0
    );

    const now = new Date();

    const upcoming = trips.filter((trip) => {
      if (!trip.dateFrom) {
        return false;
      }

      return new Date(trip.dateFrom) > now;
    }).length;

    const uniqueDest = new Set(
      trips.map((trip) => trip.destination).filter(Boolean)
    ).size;

    return {
      totalTrips,
      totalSpent,
      upcoming,
      uniqueDest,
    };
  }, [trips, tripExpenseTotals]);

  if (openTrip) {
    const latestTrip = trips.find((trip) => trip.id === openTrip.id) || openTrip;

    return (
      <>
        <TripDetail
          trip={latestTrip}
          onBack={() => setOpenTrip(null)}
          onEditTrip={handleEdit}
        />

        {showForm && (
          <TripForm trip={editingTrip} onClose={handleCloseForm} />
        )}
      </>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Trips</h1>
            <p className="mt-1 text-gray-600">
              All your group trips in one place.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white shadow-sm hover:bg-blue-700"
          >
            <Plus className="mr-2 inline h-5 w-5" />
            New trip
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total trips",
            value: stats.totalTrips,
            icon: MapPin,
          },
          {
            label: "Total spent",
            value: new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(stats.totalSpent),
            icon: DollarSign,
          },
          {
            label: "Upcoming",
            value: stats.upcoming,
            icon: Calendar,
          },
          {
            label: "Destinations",
            value: stats.uniqueDest,
            icon: MapPin,
          },
        ].map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <Icon className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {loading ? (
        <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center text-gray-500">
          Loading trips...
        </div>
      ) : trips.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
            <MapPin className="h-10 w-10 text-blue-500" />
          </div>

          <h3 className="text-2xl font-bold text-gray-900">No trips yet</h3>

          <p className="mx-auto mt-2 max-w-md text-gray-600">
            Create your first trip to start tracking shared expenses and
            splitting costs with your group.
          </p>

          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
          >
            <Plus className="mr-2 inline h-5 w-5" />
            Create your first trip
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {trips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              totalExpenses={tripExpenseTotals[trip.id] || 0}
              memberCount={(trip.members || []).length}
              onOpen={setOpenTrip}
              onEdit={handleEdit}
              onDelete={setDeletingTrip}
              onShare={setSharingTrip}
            />
          ))}
        </div>
      )}

      {showForm && (
        <TripForm trip={editingTrip} onClose={handleCloseForm} />
      )}

      {sharingTrip && (
        <ShareTripModal
          trip={sharingTrip}
          onClose={() => setSharingTrip(null)}
        />
      )}

      {deletingTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-gray-900">Delete trip?</h2>

            <p className="mt-2 text-sm text-gray-600">
              <span className="font-semibold">{deletingTrip.name}</span> and
              all its expenses will be permanently deleted.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeletingTrip(null)}
                className="rounded-xl border border-gray-300 px-4 py-2.5 font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="rounded-xl bg-red-600 px-4 py-2.5 font-semibold text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}