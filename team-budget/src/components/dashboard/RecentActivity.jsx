import React from 'react';
import { Clock, UserPlus, DollarSign, CreditCard, AlertCircle } from 'lucide-react';
import { formatDateTime } from '../../utils/helpers';

export default function RecentActivity({ players, expenses, payments }) {
  // Generate recent activity from all data
  const activities = [
    // Recent player additions
    ...players.slice(-3).map(player => ({
      type: 'player_added',
      message: `Added ${player.name} to the team`,
      timestamp: player.createdAt,
      icon: UserPlus,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    })),
    
    // Recent expenses
    ...expenses.slice(-3).map(expense => ({
      type: 'expense_added',
      message: `Recorded $${expense.total?.toFixed(2)} expense for ${expense.month} ${expense.year}`,
      timestamp: expense.createdAt,
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    })),
    
    // Recent payments
    ...payments.slice(-3).map(payment => ({
      type: 'payment_received',
      message: `Received $${payment.amount?.toFixed(2)} payment`,
      timestamp: payment.createdAt,
      icon: CreditCard,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    }))
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
   .slice(0, 5); // Get 5 most recent activities

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
          return (
            <div key={index} className="flex items-start space-x-3">
              <div className={`flex-shrink-0 p-2 rounded-lg ${activity.bgColor}`}>
                <Icon className={`h-4 w-4 ${activity.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.message}</p>
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