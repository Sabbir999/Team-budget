import React from "react";
import { AlertCircle, Clock, CreditCard, DollarSign } from "lucide-react";
import { formatCurrency, formatDateTime } from "../../../../utils/helpers";

export default function RecentActivity({ expenses = [], payments = [] }) {
  const toTimestamp = (item) => item?.createdAt || item?.updatedAt || 0;

  const expenseActivities = (expenses.length > 100 ? expenses.slice(-100) : expenses).map((expense) => ({
    type: "expense_added",
    message: `Recorded ${formatCurrency(expense.total || expense.amount || 0)} expense for ${expense.month || ""} ${expense.year || ""}`.trim(),
    timestamp: toTimestamp(expense),
    icon: DollarSign,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  }));

  const paymentActivities = (payments.length > 200 ? payments.slice(-200) : payments).map((payment) => {
    const status = (payment.status || "").toString().toLowerCase();
    const period = payment.month ? ` for ${payment.month} ${payment.year || ""}` : "";

    if ((status === "paid" || status === "completed" || status === "confirmed") && payment.paidAt) {
      return {
        type: "payment_received",
        message: `Received ${formatCurrency(payment.amount || 0)}${period}`,
        timestamp: payment.paidAt,
        icon: CreditCard,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
      };
    }

    return {
      type: "payment_recorded",
      message: `Recorded ${formatCurrency(payment.amount || 0)} payment${period}`,
      timestamp: toTimestamp(payment),
      icon: AlertCircle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    };
  });

  const activities = [...expenseActivities, ...paymentActivities]
    .filter((activity) => activity.timestamp && Number(activity.timestamp) > 0)
    .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
    .slice(0, 6);

  if (activities.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-medium text-gray-900">Recent Activity</h3>
        <div className="py-8 text-center">
          <Clock className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
          <p className="mt-1 text-sm text-gray-500">Activity will appear here as you use the app.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-medium text-gray-900">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <div key={`${activity.type}-${activity.timestamp}-${index}`} className="flex items-start space-x-3">
              <div className={`flex-shrink-0 rounded-lg p-2 ${activity.bgColor}`}>
                <Icon className={`h-4 w-4 ${activity.color}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                <p className="text-sm text-gray-500">{formatDateTime(activity.timestamp)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
