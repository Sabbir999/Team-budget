import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StatCard({ name, value, icon: Icon, color, bgColor, trend }) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="flex flex-col justify-between bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 hover:shadow-md transition-shadow duration-200 min-h-[120px] max-w-full">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center min-w-0 gap-3">
          {/* icon container: fixed size so text doesn't push it */}
          <div className={`flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-lg ${bgColor}`}> 
            <Icon className={`h-6 w-6 ${color}`} />
          </div>

          {/* text: allow truncation and prevent wrapping */}
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-600 truncate">{name}</p>
            <p className="text-2xl sm:text-2xl font-semibold text-gray-900 truncate">{value}</p>
          </div>
        </div>

        {/* trend: keep compact and prevent it from forcing layout changes */}
        <div className={`flex-shrink-0 ml-2 flex items-center ${getTrendColor()}`}>{getTrendIcon()}</div>
      </div>

      {/* Progress bar for collection rate */}
      {name === 'Collection Rate' && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${value.replace('%', '')}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
