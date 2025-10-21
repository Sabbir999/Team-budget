import React from 'react';
import { Edit2, Trash2, Users, Feather } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

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

  // Format shuttlecock display
  const formatShuttlecocks = (shuttlecocks) => {
    if (!shuttlecocks || !Array.isArray(shuttlecocks)) return 'None';
    
    const displayNames = shuttlecocks.map(s => 
      s.type === 'Custom' ? s.customName : s.type
    );
    
    if (displayNames.length === 1) return displayNames[0];
    if (displayNames.length === 2) return displayNames.join(' & ');
    return `${displayNames.length} types`;
  };

  // Calculate totals
  const totals = expenses.reduce((acc, expense) => ({
    indoor: acc.indoor + (expense.indoor || 0),
    shuttlecock: acc.shuttlecock + (expense.shuttlecock || 0),
    equipment: acc.equipment + (expense.equipment || 0),
    other: acc.other + (expense.other || 0),
    total: acc.total + (expense.total || 0)
  }), { indoor: 0, shuttlecock: 0, equipment: 0, other: 0, total: 0 });

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
                Indoor ($)
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Shuttlecock ($)
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Equipment ($)
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Other ($)
              </th>
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
                Shuttlecocks
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {expenses.map((expense) => (
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${(expense.indoor || 0).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${(expense.shuttlecock || 0).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${(expense.equipment || 0).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${(expense.other || 0).toFixed(2)}
                </td>
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
                  <div className="text-sm text-gray-600 max-w-xs">
                    {formatShuttlecocks(expense.shuttlecockUsed)}
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
            ))}
            
            {/* Totals Row */}
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 font-semibold border-t-2 border-gray-300">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                TOTAL
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${totals.indoor.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${totals.shuttlecock.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${totals.equipment.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${totals.other.toFixed(2)}
              </td>
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