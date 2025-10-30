import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Users, CreditCard, Target, Percent } from 'lucide-react';

export default function FinancialOverview({ expenses, payments }) {
  const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.total || 0), 0);
  // Only sum payments that are actually paid (status === 'paid' / 'completed' / 'confirmed')
  const totalCollected = payments.reduce((sum, payment) => {
    const status = (payment.status || '').toString().toLowerCase();
    if (status === 'paid' || status === 'completed' || status === 'confirmed') {
      return sum + (Number(payment.amount) || 0);
    }
    return sum;
  }, 0);
  const outstanding = totalExpenses - totalCollected;
  const collectionRate = totalExpenses > 0 ? (totalCollected / totalExpenses) * 100 : 0;

  const financialData = [
    {
      label: 'Total Expenses',
      value: totalExpenses,
      format: 'currency',
      trend: 'neutral',
      icon: DollarSign,
      color: 'blue'
    },
    {
      label: 'Total Collected',
      value: totalCollected,
      format: 'currency',
      trend: totalCollected > 0 ? 'up' : 'neutral',
      icon: CreditCard,
      color: 'green'
    },
    {
      label: outstanding >= 0 ? 'Amount Due' : 'Overpaid',
      value: Math.abs(outstanding),
      format: 'currency',
      trend: outstanding > 0 ? 'down' : outstanding < 0 ? 'up' : 'neutral',
      icon: Users,
      color: outstanding > 0 ? 'red' : outstanding < 0 ? 'green' : 'gray'
    },
    {
      label: 'Collection Rate',
      value: collectionRate,
      format: 'percentage',
      trend: collectionRate >= 80 ? 'up' : collectionRate >= 50 ? 'neutral' : 'down',
      icon: Target,
      color: collectionRate >= 80 ? 'green' : collectionRate >= 50 ? 'yellow' : 'red'
    }
  ];

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Percent className="h-4 w-4 text-gray-400" />;
    }
  };

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      red: 'bg-red-100 text-red-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      gray: 'bg-gray-100 text-gray-600'
    };
    return colorMap[color] || colorMap.gray;
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

  const getOutstandingText = () => {
    if (outstanding > 0) {
      return `${formatValue(outstanding, 'currency')} still to collect`;
    } else if (outstanding < 0) {
      return `${formatValue(Math.abs(outstanding), 'currency')} overpaid`;
    }
    return 'All payments collected';
  };

  const getProgressColor = (rate) => {
    if (rate >= 80) return 'bg-gradient-to-r from-green-500 to-green-600';
    if (rate >= 50) return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
    return 'bg-gradient-to-r from-red-500 to-red-600';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Financial Overview</h3>
        <div className="flex items-center space-x-2">
          <DollarSign className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-500">Real-time</span>
        </div>
      </div>

      {/* Financial Metrics Grid: use auto-fit minmax so cards keep a readable min width */}
      <div className="grid gap-4 mb-6 grid-cols-[repeat(auto-fit,_minmax(220px,_1fr))]">
        {financialData.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-colors min-h-[84px]">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {/* fixed-size icon box so text doesn't push layout */}
                  <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg ${getColorClasses(item.color)}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-600 truncate">{item.label}</p>
                    <p className="text-lg font-bold text-gray-900 truncate">
                      {formatValue(item.value, item.format)}
                    </p>
                  </div>
                </div>

                <div className="flex-shrink-0 ml-2">{getTrendIcon(item.trend)}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Collection Progress Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-5 border border-blue-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-semibold text-gray-700">Collection Progress</span>
          </div>
          <span className="text-lg font-bold text-gray-900">{collectionRate.toFixed(1)}%</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
          <div 
            className={`h-3 rounded-full transition-all duration-1000 ease-out ${getProgressColor(collectionRate)}`}
            style={{ width: `${Math.min(collectionRate, 100)}%` }}
          ></div>
        </div>
        
        {/* Progress Labels */}
        <div className="flex justify-between text-xs text-gray-600 mb-3">
          <span>0%</span>
          <span className="font-medium">Target: 100%</span>
          <span>100%</span>
        </div>

        {/* Status Message */}
        <div className="text-center">
          <p className={`text-sm font-medium ${
            collectionRate >= 80 ? 'text-green-600' : 
            collectionRate >= 50 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {collectionRate >= 80 ? '🎉 Excellent collection rate!' :
             collectionRate >= 50 ? '📊 Good progress, keep going!' :
             '📢 More payments needed'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {getOutstandingText()}
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 mt-4 text-center">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500">Expense Records</p>
          <p className="text-sm font-semibold text-gray-900">{expenses.length}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500">Payment Records</p>
          <p className="text-sm font-semibold text-gray-900">{payments.length}</p>
        </div>
      </div>
    </div>
  );
}