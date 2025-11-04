import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import Modal from '../common/Modal';
import { Plus, X } from 'lucide-react';
import { sportsConfig, expenseCategories } from '../../config/sportsConfig'; // 🆕 ADD IMPORT

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function ExpenseForm({ expense, onClose }) {
  const { createExpense, updateExpense, currentTeam, currentSport, setCurrentSport } = useData(); // 🆕 ADD SPORT
  const [loading, setLoading] = useState(false);
  const currentYear = new Date().getFullYear();
  
  const sportConfig = sportsConfig[currentSport]; // 🆕 GET SPORT CONFIG
  
  // 🆕 INITIALIZE FORM DATA BASED ON SPORT
  const initializeFormData = () => {
    const baseData = {
      month: months[new Date().getMonth()],
      year: currentYear,
      teamId: currentTeam?.id || '',
      playersCount: 0,
      notes: '',
      sport: currentSport // 🆕 INCLUDE SPORT
    };
    
    // Add sport-specific fields
    sportConfig.defaultFields.forEach(field => {
      baseData[field] = 0;
    });
    
    // Initialize dynamic fields
    if (sportConfig.dynamicFields) {
      Object.keys(sportConfig.dynamicFields).forEach(field => {
        const fieldConfig = sportConfig.dynamicFields[field];
        if (fieldConfig.type === 'multi-select') {
          baseData[field] = [];
        } else {
          baseData[field] = '';
        }
      });
    }
    
    return baseData;
  };

  const [formData, setFormData] = useState(initializeFormData());
  const [dynamicFields, setDynamicFields] = useState({}); // 🆕 DYNAMIC FIELDS STATE

  // 🆕 INITIALIZE DYNAMIC FIELDS
  const initializeDynamicFields = () => {
    const initialDynamicFields = {};
    if (sportConfig.dynamicFields) {
      Object.keys(sportConfig.dynamicFields).forEach(field => {
        const fieldConfig = sportConfig.dynamicFields[field];
        if (fieldConfig.type === 'multi-select') {
          initialDynamicFields[field] = [{ id: Date.now(), value: '', customValue: '' }];
        } else {
          initialDynamicFields[field] = fieldConfig.type === 'select' ? '' : [];
        }
      });
    }
    setDynamicFields(initialDynamicFields);
  };

  useEffect(() => {
    if (expense) {
      // If editing existing expense, use its data
      const expenseData = {
        ...initializeFormData(),
        ...expense
      };
      setFormData(expenseData);
      
      // Initialize dynamic fields for existing expense
      if (expense.sport && sportsConfig[expense.sport]?.dynamicFields) {
        const sportDynamicFields = {};
        Object.keys(sportsConfig[expense.sport].dynamicFields).forEach(field => {
          if (expense[field]) {
            if (Array.isArray(expense[field])) {
              sportDynamicFields[field] = expense[field].map((item, index) => ({
                id: Date.now() + index,
                value: item.type === 'Custom' ? 'Custom' : item.type,
                customValue: item.type === 'Custom' ? item.customName : ''
              }));
            } else {
              sportDynamicFields[field] = expense[field];
            }
          } else {
            const fieldConfig = sportsConfig[expense.sport].dynamicFields[field];
            sportDynamicFields[field] = fieldConfig.type === 'multi-select' 
              ? [{ id: Date.now(), value: '', customValue: '' }] 
              : '';
          }
        });
        setDynamicFields(sportDynamicFields);
      }
    } else {
      setFormData(initializeFormData());
      initializeDynamicFields();
    }
  }, [expense, currentTeam, currentYear, currentSport]); // 🆕 ADD currentSport DEPENDENCY

  // 🆕 HANDLE SPORT CHANGE
  const handleSportChange = (sport) => {
    setCurrentSport(sport);
  };

  // 🆕 DYNAMIC FIELD HANDLERS
  const addDynamicFieldItem = (fieldName) => {
    setDynamicFields(prev => ({
      ...prev,
      [fieldName]: [...prev[fieldName], { id: Date.now(), value: '', customValue: '' }]
    }));
  };

  const removeDynamicFieldItem = (fieldName, id) => {
    if (dynamicFields[fieldName] && dynamicFields[fieldName].length > 1) {
      setDynamicFields(prev => ({
        ...prev,
        [fieldName]: prev[fieldName].filter(item => item.id !== id)
      }));
    }
  };

  const updateDynamicFieldItem = (fieldName, id, field, value) => {
    setDynamicFields(prev => ({
      ...prev,
      [fieldName]: prev[fieldName].map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const calculateTotal = () => {
    return sportConfig.defaultFields.reduce((total, field) => {
      return total + (parseFloat(formData[field]) || 0);
    }, 0);
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
      // 🆕 FORMAT DYNAMIC FIELDS FOR DATABASE
      const formattedDynamicFields = {};
      if (sportConfig.dynamicFields) {
        Object.keys(sportConfig.dynamicFields).forEach(field => {
          const fieldConfig = sportConfig.dynamicFields[field];
          if (fieldConfig.type === 'multi-select') {
            const validItems = dynamicFields[field]?.filter(item => {
              if (!item.value) return false;
              if (item.value === 'Custom' && !item.customValue.trim()) return false;
              return true;
            });
            
            formattedDynamicFields[field] = validItems.map(item => ({
              type: item.value,
              customName: item.value === 'Custom' ? item.customValue.trim() : item.value
            }));
          } else {
            formattedDynamicFields[field] = dynamicFields[field];
          }
        });
      }

      const expenseData = {
        ...formData,
        teamId: currentTeam.id,
        total: calculateTotal(),
        perPerson: calculatePerPerson(),
        sport: currentSport, // 🆕 INCLUDE SPORT
        ...formattedDynamicFields // 🆕 INCLUDE DYNAMIC FIELDS
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

  // 🆕 RENDER DYNAMIC FIELDS
  const renderDynamicFields = () => {
    if (!sportConfig.dynamicFields) return null;

    return Object.entries(sportConfig.dynamicFields).map(([fieldName, fieldConfig]) => {
      if (fieldConfig.type === 'multi-select') {
        const fieldItems = dynamicFields[fieldName] || [];
        
        return (
          <div key={fieldName} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700">
                {fieldConfig.label}
              </label>
              <button
                type="button"
                onClick={() => addDynamicFieldItem(fieldName)}
                className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add More
              </button>
            </div>

            <div className="space-y-3">
              {fieldItems.map((item, index) => (
                <div key={item.id} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <select
                      value={item.value}
                      onChange={(e) => updateDynamicFieldItem(fieldName, item.id, 'value', e.target.value)}
                      className="input-field w-full"
                    >
                      <option value="">Select {fieldConfig.label.toLowerCase()}</option>
                      {fieldConfig.options.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  {item.value === 'Custom' && (
                    <div className="flex-1">
                      <input
                        type="text"
                        value={item.customValue}
                        onChange={(e) => updateDynamicFieldItem(fieldName, item.id, 'customValue', e.target.value)}
                        placeholder="Enter custom name"
                        className="input-field w-full"
                      />
                    </div>
                  )}

                  {fieldItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDynamicFieldItem(fieldName, item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title={`Remove ${fieldConfig.label.toLowerCase()}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-500 mt-2">
              Select multiple {fieldConfig.label.toLowerCase()} if you used different types
            </p>
          </div>
        );
      }

      if (fieldConfig.type === 'select') {
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName} className="block text-sm font-medium text-gray-700">
              {fieldConfig.label}
            </label>
            <select
              id={fieldName}
              name={fieldName}
              value={dynamicFields[fieldName] || ''}
              onChange={(e) => setDynamicFields(prev => ({ ...prev, [fieldName]: e.target.value }))}
              className="input-field mt-1"
            >
              <option value="">Select {fieldConfig.label.toLowerCase()}</option>
              {fieldConfig.options.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        );
      }

      return null;
    });
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
        
        {/* 🆕 SPORT SELECTION */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sport *
          </label>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(sportsConfig).map(([sportKey, sport]) => (
              <button
                key={sportKey}
                type="button"
                onClick={() => handleSportChange(sportKey)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  currentSport === sportKey
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">{sport.icon}</div>
                <div className="text-sm font-medium">{sport.name}</div>
              </button>
            ))}
          </div>
        </div>

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

        {/* 🆕 SPORT-SPECIFIC EXPENSE FIELDS */}
        <div className="grid grid-cols-2 gap-4">
          {sportConfig.defaultFields.map(field => {
            const fieldConfig = sportConfig.expenseFields[field];
            return (
              <div key={field}>
                <label htmlFor={field} className="block text-sm font-medium text-gray-700">
                  {fieldConfig.label} ($)
                </label>
                <input
                  type="number"
                  id={field}
                  name={field}
                  step="0.01"
                  min="0"
                  value={formData[field]}
                  onChange={handleChange}
                  className="input-field mt-1"
                />
              </div>
            );
          })}
        </div>

        {/* 🆕 DYNAMIC FIELDS */}
        {renderDynamicFields()}

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