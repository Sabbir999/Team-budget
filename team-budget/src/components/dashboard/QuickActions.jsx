import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Users, 
  DollarSign, 
  CreditCard, 
  Activity,
  BarChart3 
} from 'lucide-react';

const quickActions = [
  {
    name: 'Create Team',
    description: 'Set up a new sports team',
    href: '/teams',
    icon: Activity,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    name: 'Add Player',
    description: 'Add a new player to your team',
    href: '/players',
    icon: Users,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    name: 'Record Expense',
    description: 'Add team expenses',
    href: '/expenses',
    icon: DollarSign,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50'
  },
  {
    name: 'Log Payment',
    description: 'Record player payments',
    href: '/payments',
    icon: CreditCard,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  }
];

export default function QuickActions() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.name}
              to={action.href}
              className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:shadow-md transition-all duration-200"
            >
              <div className={`flex-shrink-0 p-2 rounded-lg ${action.bgColor}`}>
                <Icon className={`h-6 w-6 ${action.color}`} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">{action.name}</p>
                <p className="truncate text-sm text-gray-500">{action.description}</p>
              </div>
              <Plus className="h-5 w-5 text-gray-400" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}