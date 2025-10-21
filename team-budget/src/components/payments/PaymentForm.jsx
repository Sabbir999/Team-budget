import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import Modal from '../common/Modal';

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
  'unpaid'  // Added unpaid option
];

export default function PaymentForm({ payment, onClose }) {
  const { createPayment, updatePayment, currentTeam, players } = useData();
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentTeam) {
      alert('Please select a team first');
      return;
    }

    if (!formData.playerId) {
      alert('Please select a player');
      return;
    }

    // Validate amount
    const amountValue = parseFloat(formData.amount);
    if (isNaN(amountValue) || amountValue < 0) {
      alert('Please enter a valid amount');
      return;
    }

    setLoading(true);

    try {
      const paymentData = {
        ...formData,
        amount: amountValue,
        teamId: currentTeam.id
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
    
    if (name === 'amount') {
      // Allow empty string for amount so user can type 0
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
    return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
  };

  const formatPaymentMethod = (method) => {
    return method.charAt(0).toUpperCase() + method.slice(1).replace('_', ' ');
  };

  const activePlayers = players.filter(player => player.isActive);

  return (
    <Modal
      title={payment ? 'Edit Payment' : 'Record New Payment'}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="month" className="block text-sm font-medium text-gray-700">
              Month *
            </label>
            <select
              id="month"
              name="month"
              required
              value={formData.month}
              onChange={handleChange}
              className="input-field mt-1"
            >
              {months.map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700">
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
              className="input-field mt-1"
            />
          </div>
        </div>

        <div>
          <label htmlFor="playerId" className="block text-sm font-medium text-gray-700">
            Player *
          </label>
          <select
            id="playerId"
            name="playerId"
            required
            value={formData.playerId}
            onChange={handleChange}
            className="input-field mt-1"
          >
            <option value="">Select a player</option>
            {activePlayers.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount ($) *
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            required
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={handleChange}
            className="input-field mt-1"
            placeholder="0.00"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status *
            </label>
            <select
              id="status"
              name="status"
              required
              value={formData.status}
              onChange={handleChange}
              className="input-field mt-1"
            >
              {paymentStatuses.map((status) => (
                <option key={status} value={status}>
                  {formatStatus(status)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
              Payment Method *
            </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              required
              value={formData.paymentMethod}
              onChange={handleChange}
              className="input-field mt-1"
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
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={formData.notes}
            onChange={handleChange}
            className="input-field mt-1"
            placeholder="Any additional notes about this payment..."
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? 'Saving...' : (payment ? 'Update Payment' : 'Record Payment')}
          </button>
        </div>
      </form>
    </Modal>
  );
}