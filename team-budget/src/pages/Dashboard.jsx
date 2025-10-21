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
    <div className="min-h-screen w-full overflow-x-hidden bg-gray-50">
      <div className="space-y-4 md:space-y-6 p-3 sm:p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
              Dashboard
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-gray-600 truncate">
              Welcome back! Here's your team overview.
              {currentTeam && (
                <span className="font-medium">
                  {' '}
                  Current team: {currentTeam.name}
                </span>
              )}
            </p>
          </div>
          {teams.length === 0 && (
            <Link
              to="/teams"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 sm:px-4 rounded-lg transition-colors duration-200 inline-flex items-center justify-center text-sm sm:text-base"
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Create Your First Team
            </Link>
          )}
        </div>

        {/* Stats Grid */}
        <div className="px-1 sm:px-0">
          <DashboardStats
            teams={teams}
            players={players}
            expenses={expenses}
            payments={payments}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-3">
          {/* Left Column */}
          <div className="xl:col-span-2 space-y-4 sm:space-y-6 overflow-hidden">
            <div className="px-1 sm:px-0">
              <QuickActions />
            </div>
            <div className="px-1 sm:px-0">
              <RecentActivity
                players={players}
                expenses={expenses}
                payments={payments}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4 sm:space-y-6 overflow-hidden">
            <div className="px-1 sm:px-0">
              <FinancialOverview expenses={expenses} payments={payments} />
            </div>

            {/* Teams Summary */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mx-1 sm:mx-0">
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">
                Your Teams
              </h3>
              {teams.length === 0 ? (
                <div className="text-center py-4 sm:py-8">
                  <p className="text-xs sm:text-sm text-gray-500">
                    No teams yet. Create your first team to get started.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-3 overflow-y-auto max-h-[300px] pr-2">
                  {teams.slice(0, 3).map((team) => (
                    <div
                      key={team.id}
                      className="flex items-center justify-between py-1 sm:py-2"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {team.name}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 capitalize truncate">
                          {team.sportType}
                        </p>
                      </div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ml-2 flex-shrink-0">
                        {team.currency}
                      </span>
                    </div>
                  ))}
                  {teams.length > 3 && (
                    <Link
                      to="/teams"
                      className="block text-center text-xs sm:text-sm text-blue-600 hover:text-blue-500 font-medium py-1 sm:py-2"
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
    </div>
  );
}
