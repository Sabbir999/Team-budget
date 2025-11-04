import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { LogOut, ChevronDown, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { currentUser, logout } = useAuth();
  const { currentTeam, teams, setCurrentTeam } = useData();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleSettingsClick = () => {
    setShowUserMenu(false);
    navigate('/settings');
  };

  const getUserInitials = (email) => {
    return email ? email.charAt(0).toUpperCase() : 'U';
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100/80 shadow-sm z-50 sticky top-0">
      {/* Full-width container (no centering restriction) */}
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Flex layout: left and right pinned */}
        <div className="flex justify-between items-center py-3 w-full">

          {/* Left Section - Team Selector */}
          <div className="flex items-center gap-3 min-w-[180px] w-full sm:w-auto max-w-[50%]">
            {teams.length > 0 && (
              <div className="relative group w-full sm:w-auto">
                <select
                  value={currentTeam?.id || ''}
                  onChange={(e) => {
                    const team = teams.find(t => t.id === e.target.value);
                    if (team) setCurrentTeam(team);
                  }}
                  className="appearance-none w-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/50 rounded-xl pl-4 pr-10 py-2.5 text-sm font-medium text-gray-700 hover:from-blue-100 hover:to-indigo-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all duration-200 cursor-pointer shadow-sm truncate"
                >
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name} • {team.sportType}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <ChevronDown className="h-4 w-4 text-blue-500 group-hover:text-blue-600 transition-colors" />
                </div>
              </div>
            )}
          </div>

          {/* Right Section - User Menu */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-1.5 rounded-xl hover:bg-gray-50/80 transition-all duration-200 border border-transparent hover:border-gray-200/50 group"
              >
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg text-white text-sm font-semibold shadow-sm">
                  {getUserInitials(currentUser?.email)}
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900 leading-none">
                      {currentUser?.displayName || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {currentUser?.email}
                    </p>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`}
                  />
                </div>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-gray-100/80 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-100/50">
                    <p className="text-sm font-semibold text-gray-900">
                      {currentUser?.displayName || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {currentUser?.email}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      onClick={handleSettingsClick}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50/50 transition-colors duration-150"
                    >
                      <Settings className="h-4 w-4 text-gray-400" />
                      <span>Settings</span>
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-100/50 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50/50 transition-colors duration-150 group"
                    >
                      <LogOut className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
