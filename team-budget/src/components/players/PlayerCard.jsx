import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Mail, Phone, Edit2, Trash2, MoreVertical, Users } from 'lucide-react';

export default function PlayerCard({ player, teamName, onEdit }) {
  const { deletePlayer } = useData();
  const [showMenu, setShowMenu] = useState(false);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${player.name}"? This will also remove their payment history.`)) {
      try {
        await deletePlayer(player.id);
      } catch (error) {
        console.error('Error deleting player:', error);
        alert('Failed to delete player: ' + error.message);
      }
    }
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-white">
              {player.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{player.name}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                player.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {player.isActive ? 'Active' : 'Inactive'}
              </span>
              {teamName && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <Users className="h-3 w-3 mr-1" />
                  {teamName}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={toggleMenu}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1">
                <button
                  onClick={() => {
                    onEdit(player);
                    setShowMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    handleDelete();
                    setShowMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        {player.email && (
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
            <a 
              href={`mailto:${player.email}`}
              className="hover:text-blue-600 transition-colors truncate"
              title={player.email}
            >
              {player.email}
            </a>
          </div>
        )}
        
        {player.phone && (
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
            <a 
              href={`tel:${player.phone}`}
              className="hover:text-blue-600 transition-colors"
            >
              {player.phone}
            </a>
          </div>
        )}
      </div>

      {player.notes && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 line-clamp-2">{player.notes}</p>
        </div>
      )}
    </div>
  );
}