import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Settings() {
  const { currentUser } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <p className="mt-1 text-sm text-gray-900">{currentUser?.email}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">User ID</label>
            <p className="mt-1 text-sm text-gray-900 font-mono">{currentUser?.uid}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">About TeamBudget</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <p>
            TeamBudget is a simple and effective way to track expenses and payments for your sports teams.
          </p>
          <p>
            Features include:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Team management for different sports</li>
            <li>Player roster management</li>
            <li>Expense tracking with monthly breakdowns</li>
            <li>Payment recording and status tracking</li>
            <li>Real-time data synchronization</li>
            <li>Multi-currency support</li>
          </ul>
        </div>
      </div>
    </div>
  );
}