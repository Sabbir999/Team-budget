import React from 'react';
import { MapPin, Calendar, CreditCard, Edit2, Trash2 } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

export default function TeamCard({ team, onEdit }) {
  const { deleteTeam, setCurrentTeam } = useData();

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${team.name}"? This action cannot be undone.`)) {
      try {
        await deleteTeam(team.id);
      } catch (error) {
        console.error('Error deleting team:', error);
        alert('Failed to delete team: ' + error.message);
      }
    }
  };

  const handleSetActive = () => {
    setCurrentTeam(team);
  };

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 capitalize">
            {team.sportType}
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(team)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        {team.location && (
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{team.location}</span>
          </div>
        )}
        
        {team.schedule && (
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{team.schedule}</span>
          </div>
        )}
        
        {team.paymentMethod && (
          <div className="flex items-center">
            <CreditCard className="h-4 w-4 mr-2" />
            <span className="capitalize">{team.paymentMethod}</span>
            {team.paymentDetails && (
              <span className="ml-1">- {team.paymentDetails}</span>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
        <span className="text-sm font-medium text-gray-900">
          {team.currency}
        </span>
        <button
          onClick={handleSetActive}
          className="text-sm text-primary-500 hover:text-primary-600 font-medium"
        >
          Set Active
        </button>
      </div>
    </div>
  );
}