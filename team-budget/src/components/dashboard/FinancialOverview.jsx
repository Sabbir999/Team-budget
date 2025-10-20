import React from 'react';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

export default function FinancialOverview({ expenses, payments }) {
  const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.total || 0), 0);
  const totalCollected = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
  const outstanding = totalExpenses - totalCollected;
  const collectionRate = totalExpenses > 0 ? (totalCollected / totalExpenses) * 100 : 0;

  const financialData = [
    {
      label: 'Total Expenses',
      value: totalExpenses,
      format: 'currency',
      trend: 'neutral'
    },
    {
      label: 'Total Collected',
      value: totalCollected,
      format: 'currency',
      trend: 'up'
    },
    {
      label: 'Outstanding',
      value: Math.abs(outstanding),
      format: 'currency',
      trend: outstanding > 0 ? 'up' : 'down'
    },
    {
      label: 'Collection Rate',
      value: collectionRate,
      format: 'percentage',
      trend: collectionRate >= 80 ? 'up' : 'down'
    }
  ];

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <DollarSign className="h-4 w-4 text-gray-400" />;
    }
  };

  const formatValue = (value, format) => {
    switch (format) {
      case 'currency':
        return `$${value.toFixed(2)}`;
      case 'percentage':
        return `${value.toFixed(1)}%`;
      default:
        return value;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Overview</h3>
      <div className="space-y-4">
        {financialData.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">{item.label}</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-gray-900">
                {formatValue(item.value, item.format)}
              </span>
              {getTrendIcon(item.trend)}
            </div>
          </div>
        ))}
      </div>
      
      {/* Collection progress bar */}
      <div className="mt-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Collection Progress</span>
          <span>{collectionRate.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              collectionRate >= 80 ? 'bg-green-500' : 
              collectionRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(collectionRate, 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}