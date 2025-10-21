import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import TeamForm from '../components/teams/TeamForm';
import TeamCard from '../components/teams/TeamCard';
import { Plus, Users, Trophy, Filter, Search, MapPin, Calendar, CreditCard } from 'lucide-react';

export default function Teams() {
  const { teams, currentTeam, setCurrentTeam } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sportFilter, setSportFilter] = useState('all');

  const handleEdit = (team) => {
    setEditingTeam(team);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTeam(null);
  };

  // Use useMemo for better performance with filtering
  const filteredTeams = useMemo(() => {
    return teams.filter(team => {
      const matchesSearch = team.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           team.location?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSport = sportFilter === 'all' || team.sportType === sportFilter;
      return matchesSearch && matchesSport;
    });
  }, [teams, searchTerm, sportFilter]);

  // Get unique sport types for filter
  const sportTypes = useMemo(() => {
    return ['all', ...new Set(teams.map(team => team.sportType).filter(Boolean))];
  }, [teams]);

  // Stats calculations
  const stats = useMemo(() => {
    const totalTeams = teams.length;
    const uniqueSports = new Set(teams.map(t => t.sportType)).size;
    const teamsWithLocation = teams.filter(t => t.location).length;
    
    return { totalTeams, uniqueSports, teamsWithLocation };
  }, [teams]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Team Management
          </h1>
          <p className="mt-2 text-gray-600 max-w-2xl">
            Organize your sports teams, track expenses, and manage player payments all in one place.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 inline-flex items-center justify-center group"
        >
          <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-200" />
          Create New Team
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-xl mr-4">
              <Trophy className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Teams</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTeams}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-xl mr-4">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Sports Types</p>
              <p className="text-2xl font-bold text-gray-900">{stats.uniqueSports}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-xl mr-4">
              <MapPin className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">With Locations</p>
              <p className="text-2xl font-bold text-gray-900">{stats.teamsWithLocation}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-xl mr-4">
              <Trophy className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active Team</p>
              <p className="text-lg font-bold text-gray-900 truncate" title={currentTeam?.name}>
                {currentTeam?.name || 'None selected'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search teams by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          
          <select
            value={sportFilter}
            onChange={(e) => setSportFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
          >
            {sportTypes.map(sport => (
              <option key={sport} value={sport}>
                {sport === 'all' ? 'All Sports' : sport.charAt(0).toUpperCase() + sport.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        {/* Results Count and Active Filters */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredTeams.length}</span> of{' '}
            <span className="font-semibold text-gray-900">{teams.length}</span> teams
          </div>
          
          {(searchTerm || sportFilter !== 'all') && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              <div className="flex flex-wrap gap-2">
                {searchTerm && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Search: "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm('')}
                      className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </span>
                )}
                {sportFilter !== 'all' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Sport: {sportFilter}
                    <button
                      onClick={() => setSportFilter('all')}
                      className="ml-1 hover:bg-purple-200 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Teams Grid */}
      {filteredTeams.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="mx-auto h-24 w-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center mb-6 border border-gray-200">
            <Trophy className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            {teams.length === 0 ? 'No teams created yet' : 'No teams found'}
          </h3>
          <p className="text-gray-600 max-w-md mx-auto mb-8 leading-relaxed">
            {teams.length === 0 
              ? 'Create your first team to start tracking expenses and managing player payments for your sports activities.'
              : `No teams match your search for "${searchTerm}"${sportFilter !== 'all' ? ` in ${sportFilter}` : ''}. Try different keywords or clear filters.`
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 inline-flex items-center justify-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Team
            </button>
            {(searchTerm || sportFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSportFilter('all');
                }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl border border-gray-300 transition-colors duration-200 inline-flex items-center justify-center"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active Team Section */}
          {currentTeam && filteredTeams.some(team => team.id === currentTeam.id) && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <div className="w-2 h-6 bg-blue-500 rounded-full mr-3"></div>
                  Active Team
                </h3>
                <span className="text-sm text-blue-600 font-medium">Currently Selected</span>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-1 transform hover:scale-[1.02] transition-transform duration-200">
                <TeamCard 
                  team={currentTeam} 
                  onEdit={handleEdit}
                  isActive={true}
                />
              </div>
            </div>
          )}

          {/* All Teams Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <div className="w-2 h-6 bg-gray-400 rounded-full mr-3"></div>
                All Teams
                <span className="ml-2 text-sm text-gray-500 font-normal">
                  ({filteredTeams.filter(team => !currentTeam || team.id !== currentTeam.id).length})
                </span>
              </h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTeams
                .filter(team => !currentTeam || team.id !== currentTeam.id)
                .map((team, index) => (
                  <TeamCard 
                    key={team.id} 
                    team={team} 
                    onEdit={handleEdit}
                    isActive={false}
                    animationDelay={index * 100} // Stagger animation
                  />
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Team Form Modal */}
      {showForm && (
        <TeamForm
          team={editingTeam}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}