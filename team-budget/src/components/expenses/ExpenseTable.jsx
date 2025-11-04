import React from 'react';
import { Edit2, Trash2, Users, Feather } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { sportsConfig } from '../../config/sportsConfig';

export default function ExpenseTable({ expenses, onEdit }) {
  const { deleteExpense } = useData();

  const handleDelete = async (expenseId, expenseName) => {
    if (window.confirm(`Are you sure you want to delete the expense record for ${expenseName}?`)) {
      try {
        await deleteExpense(expenseId);
      } catch (error) {
        console.error('Error deleting expense:', error);
        alert('Failed to delete expense: ' + error.message);
      }
    }
  };

  // FORMAT DYNAMIC FIELDS DISPLAY
  const formatDynamicFields = (expense) => {
    if (!expense.sport || !sportsConfig[expense.sport]?.dynamicFields) return 'None';
    
    const dynamicData = [];
    Object.keys(sportsConfig[expense.sport].dynamicFields).forEach(field => {
      if (expense[field]) {
        if (Array.isArray(expense[field])) {
          const items = expense[field].map(item => 
            item.type === 'Custom' ? item.customName : item.type
          ).filter(Boolean);
          if (items.length > 0) {
            if (items.length === 1) {
              dynamicData.push(items[0]);
            } else if (items.length === 2) {
              dynamicData.push(items.join(' & '));
            } else {
              dynamicData.push(`${items.length} types`);
            }
          }
        } else if (expense[field]) {
          dynamicData.push(expense[field]);
        }
      }
    });
    
    return dynamicData.length > 0 ? dynamicData.join(', ') : 'None';
  };

  // CALCULATE TOTALS CORRECTLY - Use stored totals from expenses
  const calculateTotals = () => {
    const totals = {
      total: 0
    };

    // Initialize all possible fields to 0
    const allFields = getAllExpenseFields();
    allFields.forEach(field => {
      totals[field] = 0;
    });

    expenses.forEach(expense => {
      const sportConfig = sportsConfig[expense.sport] || sportsConfig.badminton;
      
      // Add all expense fields to their respective totals
      Object.keys(sportConfig.expenseFields).forEach(field => {
        if (totals[field] !== undefined) {
          totals[field] += expense[field] || 0;
        }
      });
      
      // Use the actual stored total from the expense
      totals.total += expense.total || 0;
    });

    return totals;
  };

  // GET ALL UNIQUE EXPENSE FIELDS ACROSS SPORTS
  const getAllExpenseFields = () => {
    const allFields = new Set();
    expenses.forEach(expense => {
      const sportConfig = sportsConfig[expense.sport] || sportsConfig.badminton;
      Object.keys(sportConfig.expenseFields).forEach(field => {
        allFields.add(field);
      });
    });
    return Array.from(allFields);
  };

  // GET FIELD LABEL FOR DISPLAY
  const getFieldLabel = (field, sport) => {
    const sportConfig = sportsConfig[sport] || sportsConfig.badminton;
    return sportConfig.expenseFields[field]?.label || field;
  };

  // GET ABBREVIATED LABEL FOR TABLE HEADERS
  const getAbbreviatedLabel = (field, sport) => {
    const fullLabel = getFieldLabel(field, sport);
    // Return first word or first 8 characters for compact display
    const words = fullLabel.split(' ');
    if (words.length > 1) {
      return words.map(word => word.substring(0, 4)).join(' ');
    }
    return fullLabel.substring(0, 8);
  };

  const totals = calculateTotals();
  const allExpenseFields = getAllExpenseFields();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Month/Year
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Sport
              </th>
              
              {/* DYNAMIC EXPENSE COLUMNS */}
              {allExpenseFields.map(field => (
                <th 
                  key={field} 
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  title={getFieldLabel(field, 'badminton')}
                >
                  {getAbbreviatedLabel(field, 'badminton')} ($)
                </th>
              ))}
              
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Total ($)
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                <Users className="h-4 w-4 inline mr-1" />
                Players
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Per Person ($)
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                <Feather className="h-4 w-4 inline mr-1" />
                Details
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {expenses.map((expense) => {
              const sportConfig = sportsConfig[expense.sport] || sportsConfig.badminton;
              
              return (
                <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {expense.month} {expense.year}
                    </div>
                    {expense.notes && (
                      <div className="text-xs text-gray-500 mt-1 max-w-xs truncate" title={expense.notes}>
                        {expense.notes}
                      </div>
                    )}
                  </td>
                  
                  {/* SPORT COLUMN */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{sportConfig.icon}</span>
                      <span className="text-sm font-medium text-gray-900">
                        {sportConfig.name}
                      </span>
                    </div>
                  </td>
                  
                  {/* DYNAMIC EXPENSE FIELDS */}
                  {allExpenseFields.map(field => {
                    const value = expense[field] || 0;
                    const isFieldPresent = sportConfig.expenseFields[field];
                    
                    return (
                      <td 
                        key={field} 
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                        title={isFieldPresent ? getFieldLabel(field, expense.sport) : 'Not applicable'}
                      >
                        {isFieldPresent ? `$${value.toFixed(2)}` : '-'}
                      </td>
                    );
                  })}
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                    ${(expense.total || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-400 mr-1" />
                      {expense.playersCount || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                    ${(expense.perPerson || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600 max-w-xs" title={formatDynamicFields(expense)}>
                      {formatDynamicFields(expense)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onEdit(expense)}
                        className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded-lg hover:bg-blue-50"
                        title="Edit expense"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id, `${expense.month} ${expense.year}`)}
                        className="text-red-600 hover:text-red-800 transition-colors p-1 rounded-lg hover:bg-red-50"
                        title="Delete expense"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            
            {/* TOTALS ROW */}
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 font-semibold border-t-2 border-gray-300">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                TOTAL
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                -
              </td>
              
              {/* DYNAMIC TOTALS COLUMNS */}
              {allExpenseFields.map(field => (
                <td key={field} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${(totals[field] || 0).toFixed(2)}
                </td>
              ))}
              
              <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700">
                ${totals.total.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                -
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                -
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                -
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                -
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}