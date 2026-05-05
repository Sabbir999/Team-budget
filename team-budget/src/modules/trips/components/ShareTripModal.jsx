import React, { useState } from "react";
import { Copy, X } from "lucide-react";

import { useAuth } from "../../../contexts/AuthContext.jsx";
import { tripSharingAPI } from "../api/tripSharingAPI.js";

export default function ShareTripModal({ trip, onClose }) {
  const { currentUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const createShareLink = async () => {
    if (!currentUser?.uid || !trip?.id) {
      setError("Missing user or trip.");
      return;
    }

    setLoading(true);
    setError("");
    setCopied(false);

    try {
      const sharedTrip = await tripSharingAPI.createReadOnlyShare(
        currentUser.uid,
        trip.id
      );

      const url = `${window.location.origin}/trips/share/${sharedTrip.id}`;
      setShareUrl(url);
    } catch (err) {
      setError(err.message || "Could not create share link.");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async () => {
    if (!shareUrl) {
      return;
    }

    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Share trip</h2>
            <p className="mt-1 text-sm text-gray-500">
              Create a read-only link for {trip?.name || "this trip"}.
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

        <div className="mb-4 rounded-xl bg-blue-50 p-4 text-sm text-blue-700">
          Anyone with this link can view this trip snapshot. They cannot edit it.
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

        {!shareUrl ? (
          <button
            type="button"
            onClick={createShareLink}
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 font-bold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Creating link..." : "Create read-only link"}
          </button>
        ) : (
          <div className="space-y-3">
            <label className="block">
              <span className="text-sm font-semibold text-gray-700">
                Share link
              </span>
              <input
                readOnly
                value={shareUrl}
                className="mt-1 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm"
              />
            </label>

            <button
              type="button"
              onClick={copyLink}
              className="inline-flex w-full items-center justify-center rounded-xl border border-gray-300 px-4 py-3 font-bold text-gray-700 hover:bg-gray-50"
            >
              <Copy className="mr-2 h-4 w-4" />
              {copied ? "Copied" : "Copy link"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

