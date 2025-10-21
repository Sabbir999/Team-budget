import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import Modal from '../common/Modal';
import { Plus, X } from 'lucide-react';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const shuttlecockOptions = [
  'Aeroplane',
  'Ling-Mei',
  'Yonex AS-50',
  'Yonex AS-40',
  'Victor Gold',
  'Li-Ning A+600',
  'Custom'
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
    shuttlecockUsed: [],
    notes: ''
  });

  // State for managing shuttlecock selections
  const [shuttlecocks, setShuttlecocks] = useState([
    { id: Date.now(), type: '', customName: '' }
  ]);

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
        shuttlecockUsed: expense.shuttlecockUsed || [],
        notes: expense.notes || ''
      });

      // Parse existing shuttlecock data
      if (expense.shuttlecockUsed && Array.isArray(expense.shuttlecockUsed) && expense.shuttlecockUsed.length > 0) {
        setShuttlecocks(expense.shuttlecockUsed.map((item, index) => ({
          id: Date.now() + index,
          type: item.type === 'Custom' ? 'Custom' : item.type,
          customName: item.type === 'Custom' ? item.customName : ''
        })));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        teamId: currentTeam?.id || ''
      }));
    }
  }, [expense, currentTeam, currentYear]);

  const addShuttlecock = () => {
    setShuttlecocks([...shuttlecocks, { id: Date.now(), type: '', customName: '' }]);
  };

  const removeShuttlecock = (id) => {
    if (shuttlecocks.length > 1) {
      setShuttlecocks(shuttlecocks.filter(s => s.id !== id));
    }
  };

  const updateShuttlecock = (id, field, value) => {
    setShuttlecocks(shuttlecocks.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

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

    // Validate shuttlecock selections
    const validShuttlecocks = shuttlecocks.filter(s => {
      if (!s.type) return false;
      if (s.type === 'Custom' && !s.customName.trim()) return false;
      return true;
    });

    // Format shuttlecock data
    const shuttlecockData = validShuttlecocks.map(s => ({
      type: s.type,
      customName: s.type === 'Custom' ? s.customName.trim() : s.type
    }));

    setLoading(true);

    try {
      const expenseData = {
        ...formData,
        teamId: currentTeam.id,
        total: calculateTotal(),
        perPerson: calculatePerPerson(),
        shuttlecockUsed: shuttlecockData
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
      [name]: name.includes('Count') || name === 'year' ? parseInt(value) || 0 : parseFloat(value) || 0
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
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
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

        {/* Shuttlecock Selection Section */}
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Shuttlecocks Used
            </label>
            <button
              type="button"
              onClick={addShuttlecock}
              className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add More
            </button>
          </div>

          <div className="space-y-3">
            {shuttlecocks.map((shuttlecock, index) => (
              <div key={shuttlecock.id} className="flex gap-2 items-start">
                <div className="flex-1">
                  <select
                    value={shuttlecock.type}
                    onChange={(e) => updateShuttlecock(shuttlecock.id, 'type', e.target.value)}
                    className="input-field w-full"
                  >
                    <option value="">Select shuttlecock type</option>
                    {shuttlecockOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {shuttlecock.type === 'Custom' && (
                  <div className="flex-1">
                    <input
                      type="text"
                      value={shuttlecock.customName}
                      onChange={(e) => updateShuttlecock(shuttlecock.id, 'customName', e.target.value)}
                      placeholder="Enter custom name"
                      className="input-field w-full"
                    />
                  </div>
                )}

                {shuttlecocks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeShuttlecock(shuttlecock.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Remove shuttlecock"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-500 mt-2">
            Select multiple shuttlecocks if you used different types during play
          </p>
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
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Summary</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Total Cost:</span>
              <span className="ml-2 font-semibold text-blue-700">${total.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-gray-600">Per Person:</span>
              <span className="ml-2 font-semibold text-blue-700">${perPerson.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
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