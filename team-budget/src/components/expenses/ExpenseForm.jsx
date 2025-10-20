import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import Modal from '../common/Modal';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const shuttlecockTypes = [
  'Not played',
  'Aero & Ling',
  'Yonex',
  'Victor',
  'Li-Ning',
  'Other'
];

export default function ExpenseForm({ expense, onClose }) {
  const { createExpense, updateExpense, currentTeam } = useData();
  const [loading, setLoading] = useState(false);
  const currentYear = new Date().getFullYear();
  
  const [formData, setFormData] = useState({
    month: months[new Date().getMonth()],
    year: currentYear,
    teamId: currentTeam?.id || '',
    indoor: 0,
    shuttlecock: 0,
    equipment: 0,
    other: 0,
    playersCount: 0,
    shuttlecockUsed: 'Not played',
    notes: ''
  });

  useEffect(() => {
    if (expense) {
      setFormData({
        month: expense.month || months[new Date().getMonth()],
        year: expense.year || currentYear,
        teamId: expense.teamId || currentTeam?.id || '',
        indoor: expense.indoor || 0,
        shuttlecock: expense.shuttlecock || 0,
        equipment: expense.equipment || 0,
        other: expense.other || 0,
        playersCount: expense.playersCount || 0,
        shuttlecockUsed: expense.shuttlecockUsed || 'Not played',
        notes: expense.notes || ''
      });
    } else {
      setFormData(prev => ({
        ...prev,
        teamId: currentTeam?.id || ''
      }));
    }
  }, [expense, currentTeam, currentYear]);

  const calculateTotal = () => {
    return (formData.indoor || 0) + 
           (formData.shuttlecock || 0) + 
           (formData.equipment || 0) + 
           (formData.other || 0);
  };

  const calculatePerPerson = () => {
    const total = calculateTotal();
    const players = formData.playersCount || 0;
    return players > 0 ? total / players : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentTeam) {
      alert('Please select a team first');
      return;
    }

    setLoading(true);

    try {
      const expenseData = {
        ...formData,
        teamId: currentTeam.id,
        total: calculateTotal(),
        perPerson: calculatePerPerson()
      };

      if (expense) {
        await updateExpense(expense.id, expenseData);
      } else {
        await createExpense(expenseData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving expense:', error);
      alert('Failed to save expense: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Count') ? parseInt(value) || 0 : parseFloat(value) || 0
    }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const total = calculateTotal();
  const perPerson = calculatePerPerson();

  return (
    <Modal
      title={expense ? 'Edit Expense' : 'Add New Expense'}
      onClose={onClose}
      size="lg"
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
              onChange={handleSelectChange}
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="indoor" className="block text-sm font-medium text-gray-700">
              Indoor Court Fee ($)
            </label>
            <input
              type="number"
              id="indoor"
              name="indoor"
              step="0.01"
              min="0"
              value={formData.indoor}
              onChange={handleChange}
              className="input-field mt-1"
            />
          </div>

          <div>
            <label htmlFor="shuttlecock" className="block text-sm font-medium text-gray-700">
              Shuttlecock Cost ($)
            </label>
            <input
              type="number"
              id="shuttlecock"
              name="shuttlecock"
              step="0.01"
              min="0"
              value={formData.shuttlecock}
              onChange={handleChange}
              className="input-field mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="equipment" className="block text-sm font-medium text-gray-700">
              Equipment Cost ($)
            </label>
            <input
              type="number"
              id="equipment"
              name="equipment"
              step="0.01"
              min="0"
              value={formData.equipment}
              onChange={handleChange}
              className="input-field mt-1"
            />
          </div>

          <div>
            <label htmlFor="other" className="block text-sm font-medium text-gray-700">
              Other Expenses ($)
            </label>
            <input
              type="number"
              id="other"
              name="other"
              step="0.01"
              min="0"
              value={formData.other}
              onChange={handleChange}
              className="input-field mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="playersCount" className="block text-sm font-medium text-gray-700">
              Number of Players
            </label>
            <input
              type="number"
              id="playersCount"
              name="playersCount"
              min="0"
              value={formData.playersCount}
              onChange={handleChange}
              className="input-field mt-1"
            />
          </div>

          <div>
            <label htmlFor="shuttlecockUsed" className="block text-sm font-medium text-gray-700">
              Shuttlecock Used
            </label>
            <select
              id="shuttlecockUsed"
              name="shuttlecockUsed"
              value={formData.shuttlecockUsed}
              onChange={handleSelectChange}
              className="input-field mt-1"
            >
              {shuttlecockTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
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
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            className="input-field mt-1"
            placeholder="Any additional notes about this expense..."
          />
        </div>

        {/* Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Summary</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Total Cost:</span>
              <span className="ml-2 font-semibold">${total.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-gray-600">Per Person:</span>
              <span className="ml-2 font-semibold">${perPerson.toFixed(2)}</span>
            </div>
          </div>
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
            {loading ? 'Saving...' : (expense ? 'Update Expense' : 'Add Expense')}
          </button>
        </div>
      </form>
    </Modal>
  );
}