import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import PlayerForm from '../components/players/PlayerForm';
import PlayerCard from '../components/players/PlayerCard';
import { Plus, Search, Filter, Users } from 'lucide-react';

export default function Players() {
  const { players, currentTeam, teams } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [teamFilter, setTeamFilter] = useState('all');

  const handleEdit = (player) => {
    setEditingPlayer(player);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPlayer(null);
  };

  // Filter players based on search, status, and team
  const filteredPlayers = useMemo(() => {
    return players.filter(player => {
      const matchesSearch = player.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           player.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'active' && player.isActive) ||
                           (statusFilter === 'inactive' && !player.isActive);
      
      const matchesTeam = teamFilter === 'all' || player.teamId === teamFilter;
      
      return matchesSearch && matchesStatus && matchesTeam;
    });
  }, [players, searchTerm, statusFilter, teamFilter]);

  const getTeamName = (teamId) => {
    const team = teams.find(t => t.id === teamId);
    return team ? `${team.name} (${team.sportType})` : 'Unknown Team';
  };

  if (!currentTeam && teams.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
          <Users className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No teams available</h3>
        <p className="mt-2 text-sm text-gray-500">
          Please create a team first to manage players.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Players</h1>
          <p className="mt-1 text-sm text-gray-600">
            {currentTeam 
              ? `Manage players for ${currentTeam.name} (${currentTeam.sportType})`
              : 'Manage players across all teams'
            }
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors inline-flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Player
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search players..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <select
          value={teamFilter}
          onChange={(e) => setTeamFilter(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="all">All Teams</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name} ({team.sportType})
            </option>
          ))}
        </select>
      </div>

      {/* Players Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-sm">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="text-blue-800 font-medium">Total Players</div>
          <div className="text-2xl font-bold text-blue-600">{players.length}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="text-green-800 font-medium">Active Players</div>
          <div className="text-2xl font-bold text-green-600">
            {players.filter(p => p.isActive).length}
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="text-purple-800 font-medium">Teams</div>
          <div className="text-2xl font-bold text-purple-600">
            {new Set(players.map(p => p.teamId)).size}
          </div>
        </div>
      </div>

      {/* Players Grid */}
      {filteredPlayers.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
            <Plus className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            {players.length === 0 ? 'No players yet' : 'No players found'}
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            {players.length === 0 
              ? 'Get started by adding your first player to track payments.'
              : 'Try adjusting your search or filter.'
            }
          </p>
          {players.length === 0 && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors inline-flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Player
            </button>
          )}
        </div>
      ) : (
        <div>
          <div className="mb-4 text-sm text-gray-600">
            Showing {filteredPlayers.length} of {players.length} players
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPlayers.map((player) => (
              <PlayerCard 
                key={player.id} 
                player={player}
                teamName={getTeamName(player.teamId)}
                onEdit={handleEdit}
              />
            ))}
          </div>
        </div>
      )}

      {/* Player Form Modal */}
      {showForm && (
        <PlayerForm
          player={editingPlayer}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}