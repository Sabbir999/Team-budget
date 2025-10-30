import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import Modal from '../common/Modal';
import { X, AlertCircle } from 'lucide-react';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const paymentMethods = [
  'zelle',
  'venmo', 
  'paypal',
  'cash',
  'bank_transfer',
  'other'
];

const paymentStatuses = [
  'paid',
  'pending',
  'partial',
  'unpaid'
];

export default function PaymentForm({ payment, onClose }) {
  const { createPayment, updatePayment, currentTeam, players, payments } = useData();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const currentYear = new Date().getFullYear();
  
  const [formData, setFormData] = useState({
    month: months[new Date().getMonth()],
    year: currentYear,
    teamId: currentTeam?.id || '',
    playerId: '',
    amount: '',
    status: 'paid',
    paymentMethod: 'zelle',
    notes: '',
    paidAt: Date.now()
  });

  useEffect(() => {
    if (payment) {
      setFormData({
        month: payment.month || months[new Date().getMonth()],
        year: payment.year || currentYear,
        teamId: payment.teamId || currentTeam?.id || '',
        playerId: payment.playerId || '',
        amount: payment.amount || '',
        status: payment.status || 'paid',
        paymentMethod: payment.paymentMethod || 'zelle',
        notes: payment.notes || '',
        paidAt: payment.paidAt || Date.now()
      });
    } else {
      setFormData(prev => ({
        ...prev,
        teamId: currentTeam?.id || ''
      }));
    }
  }, [payment, currentTeam, currentYear]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.playerId) {
      newErrors.playerId = 'Please select a player';
    }

    const amountValue = parseFloat(formData.amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    }

    // Check for duplicate payment (same player, month, year) when creating new
    if (!payment) {
      const duplicatePayment = payments.find(p => 
        p.playerId === formData.playerId && 
        p.month === formData.month && 
        p.year === formData.year &&
        p.id !== payment?.id
      );
      
      if (duplicatePayment) {
        const playerName = players.find(p => p.id === formData.playerId)?.name || 'Player';
        newErrors.duplicate = `${playerName} already has a payment record for ${formData.month} ${formData.year}`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!currentTeam) {
      alert('Please select a team first');
      return;
    }

    setLoading(true);

    try {
      const paymentData = {
        ...formData,
        amount: parseFloat(formData.amount),
        teamId: currentTeam.id,
        paidAt: formData.paidAt || Date.now()
      };

      if (payment) {
        await updatePayment(payment.id, paymentData);
      } else {
        await createPayment(paymentData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving payment:', error);
      alert('Failed to save payment: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (errors.duplicate) {
      setErrors(prev => ({ ...prev, duplicate: '' }));
    }
    
    if (name === 'amount') {
      // Allow empty string for amount so user can type
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? '' : value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const formatStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatPaymentMethod = (method) => {
    const methodNames = {
      zelle: 'Zelle',
      venmo: 'Venmo',
      paypal: 'PayPal',
      cash: 'Cash',
      bank_transfer: 'Bank Transfer',
      other: 'Other'
    };
    return methodNames[method] || method;
  };

  const activePlayers = players.filter(player => player.isActive);

  return (
    <Modal
      title={payment ? 'Edit Payment' : 'Record New Payment'}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.duplicate && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-red-800 text-sm">{errors.duplicate}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-1">
              Month *
            </label>
            <select
              id="month"
              name="month"
              required
              value={formData.month}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              {months.map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
              Year *
            </label>
            <input
              type="number"
              id="year"
              name="year"
              required
              min="2020"
              max="2030"
              value={formData.year}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label htmlFor="playerId" className="block text-sm font-medium text-gray-700 mb-1">
            Player *
          </label>
          <select
            id="playerId"
            name="playerId"
            required
            value={formData.playerId}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.playerId ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select a player</option>
            {activePlayers.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
          {errors.playerId && (
            <p className="text-red-500 text-sm mt-1">{errors.playerId}</p>
          )}
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount ($) *
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            required
            step="0.01"
            min="0.01"
            value={formData.amount}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.amount ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0.00"
          />
          {errors.amount && (
            <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status *
            </label>
            <select
              id="status"
              name="status"
              required
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              {paymentStatuses.map((status) => (
                <option key={status} value={status}>
                  {formatStatus(status)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method *
            </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              required
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              {paymentMethods.map((method) => (
                <option key={method} value={method}>
                  {formatPaymentMethod(method)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={formData.notes}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Any additional notes about this payment..."
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <span>{payment ? 'Update Payment' : 'Record Payment'}</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}