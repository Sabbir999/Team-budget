import React from 'react';
import { Clock, UserPlus, DollarSign, CreditCard, AlertCircle } from 'lucide-react';
import { formatDateTime, formatCurrency } from '../../utils/helpers';

export default function RecentActivity({ players, expenses, payments }) {
  // Generate recent activity from data. We take recent candidates from each source,
  // normalize them, sort by timestamp and then pick the top N to display.
  const toTimestamp = (item) => item?.createdAt || item?.updatedAt || 0;

  // Map all items (or a reasonable recent window) so updates that change updatedAt are captured.
  const recentPlayerWindow = players.length > 100 ? players.slice(-100) : players;
  const playerActivities = recentPlayerWindow.map(player => ({
    type: 'player_added',
    message: `Added ${player.name} to the team`,
    timestamp: toTimestamp(player),
    icon: UserPlus,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  }));

  const recentExpenseWindow = expenses.length > 100 ? expenses.slice(-100) : expenses;
  const expenseActivities = recentExpenseWindow.map(expense => ({
    type: 'expense_added',
    message: `Recorded ${formatCurrency(expense.total)} expense for ${expense.month || ''} ${expense.year || ''}`.trim(),
    timestamp: toTimestamp(expense),
    icon: DollarSign,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50'
  }));

  const recentPaymentWindow = payments.length > 200 ? payments.slice(-200) : payments;
  const paymentActivities = recentPaymentWindow.map(payment => {
    const status = (payment.status || '').toString().toLowerCase();
    const player = players.find(p => p.id === payment.playerId);
    const playerName = player ? ` from ${player.name}` : '';
    const period = payment.month ? ` for ${payment.month} ${payment.year || ''}` : '';

    // Only show as received if EXPLICITLY marked as paid AND has paidAt timestamp
    if ((status === 'paid' || status === 'completed' || status === 'confirmed') && payment.paidAt) {
      return {
        type: 'payment_received',
        message: `Received ${formatCurrency(payment.amount)}${playerName}${period}`,
        timestamp: payment.paidAt,
        icon: CreditCard,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        payment
      };
    }

    // Otherwise show that a payment record was created (pending/unpaid)
    return {
      type: 'payment_recorded',
      message: `Recorded ${formatCurrency(payment.amount)} payment${player ? ` for ${player.name}` : ''}`,
      timestamp: toTimestamp(payment),
      icon: AlertCircle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      payment
    };
  });

  // Combine, sort by timestamp desc, and take top 6
  // Combine, sort by timestamp desc, and take top 6 (most recent)
  const activities = [...playerActivities, ...expenseActivities, ...paymentActivities]
    .filter(a => a.timestamp && Number(a.timestamp) > 0)
    .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
    .slice(0, 6);

  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
        <div className="text-center py-8">
          <Clock className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
          <p className="mt-1 text-sm text-gray-500">
            Activity will appear here as you use the app.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          // For payments, try to include player name and month/year in the message
          let message = activity.message;
          if (activity.type === 'payment_received' && activity.payment) {
            const payment = activity.payment;
            const player = players.find(p => p.id === payment.playerId);
            const playerName = player ? ` from ${player.name}` : '';
            const period = payment.month ? ` for ${payment.month} ${payment.year || ''}` : '';
            message = `Received ${formatCurrency(payment.amount)}${playerName}${period}`;
          }

          return (
            <div key={index} className="flex items-start space-x-3">
              <div className={`flex-shrink-0 p-2 rounded-lg ${activity.bgColor}`}>
                <Icon className={`h-4 w-4 ${activity.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{message}</p>
                <p className="text-sm text-gray-500">
                  {formatDateTime(activity.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}