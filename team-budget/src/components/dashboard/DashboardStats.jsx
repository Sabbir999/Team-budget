import React from 'react';
import StatCard from './StatCard';
import { 
  Users, 
  DollarSign, 
  CreditCard, 
  Activity,
  TrendingUp,
  TrendingDown 
} from 'lucide-react';

export default function DashboardStats({ teams, players, expenses, payments }) {
  // Calculate dashboard stats
  const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.total || 0), 0);
  const totalCollected = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
  const outstanding = totalExpenses - totalCollected;
  const activePlayers = players.filter(player => player.isActive).length;
  const collectionRate = totalExpenses > 0 ? (totalCollected / totalExpenses) * 100 : 0;

  const stats = [
    {
      name: 'Active Teams',
      value: teams.length,
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: 'neutral'
    },
    {
      name: 'Active Players',
      value: activePlayers,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: 'neutral'
    },
    {
      name: 'Total Expenses',
      value: `$${totalExpenses.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      trend: 'neutral'
    },
    {
      name: 'Total Collected',
      value: `$${totalCollected.toFixed(2)}`,
      icon: CreditCard,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: 'up'
    },
    {
      name: 'Outstanding',
      value: `$${Math.abs(outstanding).toFixed(2)}`,
      icon: outstanding > 0 ? TrendingUp : TrendingDown,
      color: outstanding > 0 ? 'text-red-600' : 'text-green-600',
      bgColor: outstanding > 0 ? 'bg-red-50' : 'bg-green-50',
      trend: outstanding > 0 ? 'up' : 'down'
    },
    {
      name: 'Collection Rate',
      value: `${collectionRate.toFixed(1)}%`,
      icon: collectionRate >= 80 ? TrendingUp : TrendingDown,
      color: collectionRate >= 80 ? 'text-green-600' : 'text-yellow-600',
      bgColor: collectionRate >= 80 ? 'bg-green-50' : 'bg-yellow-50',
      trend: collectionRate >= 80 ? 'up' : 'down'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          name={stat.name}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
          bgColor={stat.bgColor}
          trend={stat.trend}
        />
      ))}
    </div>
  );
}