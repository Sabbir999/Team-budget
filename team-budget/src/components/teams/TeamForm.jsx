import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import Modal from '../common/Modal';

const sportTypes = [
  'badminton',
  'basketball',
  'soccer',
  'volleyball',
  'tennis',
  'hockey',
  'baseball',
  'football',
  'cricket',
  'rugby',
  'other'
];

const currencies = ['USD', 'CAD', 'EUR', 'GBP', 'AUD'];

export default function TeamForm({ team, onClose }) {
  const { createTeam, updateTeam } = useData();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sportType: 'badminton',
    currency: 'USD',
    location: '',
    schedule: '',
    paymentMethod: 'zelle',
    paymentDetails: ''
  });

  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name || '',
        sportType: team.sportType || 'badminton',
        currency: team.currency || 'USD',
        location: team.location || '',
        schedule: team.schedule || '',
        paymentMethod: team.paymentMethod || 'zelle',
        paymentDetails: team.paymentDetails || ''
      });
    }
  }, [team]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (team) {
        await updateTeam(team.id, formData);
      } else {
        await createTeam(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving team:', error);
      alert('Failed to save team: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Modal
      title={team ? 'Edit Team' : 'Create New Team'}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Team Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="input-field mt-1"
            placeholder="e.g., Badminton Fall 2025"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="sportType" className="block text-sm font-medium text-gray-700">
              Sport Type *
            </label>
            <select
              id="sportType"
              name="sportType"
              required
              value={formData.sportType}
              onChange={handleChange}
              className="input-field mt-1"
            >
              {sportTypes.map((sport) => (
                <option key={sport} value={sport}>
                  {sport.charAt(0).toUpperCase() + sport.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
              Currency *
            </label>
            <select
              id="currency"
              name="currency"
              required
              value={formData.currency}
              onChange={handleChange}
              className="input-field mt-1"
            >
              {currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="input-field mt-1"
            placeholder="e.g., Warren Athletic Center"
          />
        </div>

        <div>
          <label htmlFor="schedule" className="block text-sm font-medium text-gray-700">
            Schedule
          </label>
          <input
            type="text"
            id="schedule"
            name="schedule"
            value={formData.schedule}
            onChange={handleChange}
            className="input-field mt-1"
            placeholder="e.g., Every Saturday 11PM-1AM"
          />
        </div>

        <div>
          <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
            Preferred Payment Method
          </label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="input-field mt-1"
          >
            <option value="zelle">Zelle</option>
            <option value="venmo">Venmo</option>
            <option value="paypal">PayPal</option>
            <option value="cash">Cash</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="paymentDetails" className="block text-sm font-medium text-gray-700">
            Payment Details
          </label>
          <input
            type="text"
            id="paymentDetails"
            name="paymentDetails"
            value={formData.paymentDetails}
            onChange={handleChange}
            className="input-field mt-1"
            placeholder="e.g., Zelle: 313-455-6252"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? 'Saving...' : (team ? 'Update Team' : 'Create Team')}
          </button>
        </div>
      </form>
    </Modal>
  );
}