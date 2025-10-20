import React from 'react';
import { useData } from '../../contexts/DataContext';
import { Edit2, Trash2 } from 'lucide-react';

export default function PaymentTable({ payments, onEdit }) {
  const { deletePayment, players } = useData();

  const handleDelete = async (paymentId, paymentInfo) => {
    if (window.confirm(`Are you sure you want to delete this payment record?`)) {
      try {
        await deletePayment(paymentId);
      } catch (error) {
        console.error('Error deleting payment:', error);
        alert('Failed to delete payment: ' + error.message);
      }
    }
  };

  const getPlayerName = (playerId) => {
    const player = players.find(p => p.id === playerId);
    return player ? player.name : 'Unknown Player';
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      paid: { class: 'status-paid', text: 'Paid' },
      pending: { class: 'status-pending', text: 'Pending' },
      partial: { class: 'status-unpaid', text: 'Partial' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  // Calculate totals
  const totals = payments.reduce((acc, payment) => ({
    total: acc.total + (payment.amount || 0),
    paid: acc.paid + (payment.status === 'paid' ? payment.amount : 0),
    pending: acc.pending + (payment.status === 'pending' ? payment.amount : 0)
  }), { total: 0, paid: 0, pending: 0 });

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Player
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount ($)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Method
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Notes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {payment.month} {payment.year}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {getPlayerName(payment.playerId)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  ${(payment.amount || 0).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(payment.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                  {payment.paymentMethod}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600 max-w-xs truncate">
                    {payment.notes}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(payment)}
                      className="text-primary-500 hover:text-primary-700 transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(payment.id, `${payment.month} ${payment.year}`)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            
            {/* Totals Row */}
            <tr className="bg-gray-50 font-semibold">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" colSpan="2">
                TOTALS
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${totals.total.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div className="space-y-1">
                  <div>Paid: ${totals.paid.toFixed(2)}</div>
                  <div>Pending: ${totals.pending.toFixed(2)}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" colSpan="3">
                -
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}