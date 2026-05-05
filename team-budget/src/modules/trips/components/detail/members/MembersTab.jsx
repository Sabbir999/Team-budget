import React from "react";

import PersonAvatar from "../../../../people/components/PersonAvatar";
import {
  formatMoney,
  getMemberPaymentSummary,
} from "../../../utils/tripMoney";

export default function MembersTab({ memberSummary, onOpenMember }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="mb-5 font-bold text-gray-900">
        Members · {memberSummary.length}
      </h3>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {memberSummary.map((member) => {
          const payment = getMemberPaymentSummary(member);

          return (
            <div
              key={member.personId || member.id}
              className={`rounded-2xl border-t-4 bg-gray-50 p-4 ${
                payment.getsBack > 0
                  ? "border-green-400"
                  : payment.stillOwes === 0
                  ? "border-green-400"
                  : member.paymentStatus === "partial"
                  ? "border-amber-400"
                  : "border-red-400"
              }`}
            >
              <div className="mb-4 flex items-center gap-3">
                <PersonAvatar person={member.globalProfile || member} />

                <div>
                  <p className="font-bold text-gray-900">{member.name}</p>
                  <p className="text-sm text-gray-500">
                    {member.role || "Member"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-white p-3">
                  <p className="text-xs text-gray-500">Paid for group</p>
                  <p className="font-bold text-blue-600">
                    {formatMoney(payment.paidForExpenses)}
                  </p>
                </div>

                <div className="rounded-xl bg-white p-3">
                  <p className="text-xs text-gray-500">
                    {payment.getsBack > 0 ? "Gets back" : "Still owes"}
                  </p>

                  <p
                    className={
                      payment.getsBack > 0
                        ? "font-bold text-green-600"
                        : payment.stillOwes > 0
                        ? "font-bold text-red-600"
                        : "font-bold text-gray-900"
                    }
                  >
                    {payment.getsBack > 0
                      ? formatMoney(payment.getsBack)
                      : formatMoney(payment.stillOwes)}
                  </p>
                </div>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-white p-3">
                  <p className="text-xs text-gray-500">Fair share</p>
                  <p className="font-bold text-gray-900">
                    {formatMoney(payment.fairShare)}
                  </p>
                </div>

                <div className="rounded-xl bg-white p-3">
                  <p className="text-xs text-gray-500">Paid toward share</p>
                  <p className="font-bold text-green-600">
                    {formatMoney(payment.paidTowardShare)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onOpenMember(member)}
                className="mt-3 w-full rounded-xl border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-white"
              >
                View trip detail
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}