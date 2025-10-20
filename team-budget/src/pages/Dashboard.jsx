import React from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import DashboardStats from '../components/dashboard/DashboardStats';
import RecentActivity from '../components/dashboard/RecentActivity';
import QuickActions from '../components/dashboard/QuickActions';
import FinancialOverview from '../components/dashboard/FinancialOverview';
import { Plus } from 'lucide-react';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const { teams, players, expenses, payments, currentTeam } = useData();

  if (!currentUser) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Welcome back! Here's your team overview.
            {currentTeam && (
              <span className="font-medium"> Current team: {currentTeam.name}</span>
            )}
          </p>
        </div>
        {teams.length === 0 && (
          <Link
            to="/teams"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 inline-flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Team
          </Link>
        )}
      </div>

      {/* Stats Grid */}
      <DashboardStats 
        teams={teams}
        players={players}
        expenses={expenses}
        payments={payments}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <QuickActions />
          <RecentActivity 
            players={players}
            expenses={expenses}
            payments={payments}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <FinancialOverview 
            expenses={expenses}
            payments={payments}
          />
          
          {/* Teams Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Your Teams</h3>
            {teams.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500">
                  No teams yet. Create your first team to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {teams.slice(0, 3).map((team) => (
                  <div key={team.id} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{team.name}</p>
                      <p className="text-sm text-gray-500 capitalize">{team.sportType}</p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {team.currency}
                    </span>
                  </div>
                ))}
                {teams.length > 3 && (
                  <Link
                    to="/teams"
                    className="block text-center text-sm text-blue-600 hover:text-blue-500 font-medium py-2"
                  >
                    View all {teams.length} teams
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}