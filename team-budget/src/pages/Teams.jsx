import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import TeamForm from '../components/teams/TeamForm';
import TeamCard from '../components/teams/TeamCard';
import { Plus } from 'lucide-react';

export default function Teams() {
  const { teams } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);

  const handleEdit = (team) => {
    setEditingTeam(team);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTeam(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teams</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your sports teams and their settings.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary inline-flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Team
        </button>
      </div>

      {/* Teams Grid */}
      {teams.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
            <Plus className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No teams yet</h3>
          <p className="mt-2 text-sm text-gray-500">
            Get started by creating your first team to track expenses and payments.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-6 btn-primary inline-flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Team
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <TeamCard 
              key={team.id} 
              team={team} 
              onEdit={handleEdit}
            />
          ))}
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