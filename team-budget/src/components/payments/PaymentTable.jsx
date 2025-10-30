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
      paid: { class: 'bg-green-100 text-green-800', text: 'Paid' },
      pending: { class: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
      partial: { class: 'bg-orange-100 text-orange-800', text: 'Partial' },
      unpaid: { class: 'bg-red-100 text-red-800', text: 'Unpaid' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.class}`}>
        {config.text}
      </span>
    );
  };

  // Calculate totals
  const totals = payments.reduce((acc, payment) => ({
    total: acc.total + (payment.amount || 0),
    paid: acc.paid + (payment.status === 'paid' ? payment.amount : 0),
    pending: acc.pending + (payment.status === 'pending' ? payment.amount : 0),
    partial: acc.partial + (payment.status === 'partial' ? payment.amount : 0)
  }), { total: 0, paid: 0, pending: 0, partial: 0 });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
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
              <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
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
                  {payment.paymentMethod?.replace('_', ' ')}
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
                      className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded hover:bg-blue-50"
                      title="Edit payment"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(payment.id, `${payment.month} ${payment.year}`)}
                      className="text-red-600 hover:text-red-800 transition-colors p-1 rounded hover:bg-red-50"
                      title="Delete payment"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            
            {/* Totals Row */}
            <tr className="bg-gray-50 font-semibold border-t-2 border-gray-300">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" colSpan="2">
                TOTALS
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${totals.total.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Paid: ${totals.paid.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    <span>Pending: ${totals.pending.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    <span>Partial: ${totals.partial.toFixed(2)}</span>
                  </div>
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
