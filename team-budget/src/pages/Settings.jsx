import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Save, X, Eye, EyeOff, Trash2, AlertTriangle } from 'lucide-react';

export default function Settings() {
  const { currentUser, logout, updateUserProfile, updateUserPassword, updateUserEmail, deleteUserAccount, reauthenticateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeSection, setActiveSection] = useState('profile');

  // Profile state
  const [profile, setProfile] = useState({
    displayName: currentUser?.displayName || '',
    email: currentUser?.email || ''
  });

  // Password state
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Account deletion state
  const [deleteConfirm, setDeleteConfirm] = useState({
    password: '',
    confirmText: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleProfileChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswords(prev => ({ ...prev, [field]: value }));
  };

  const handleDeleteChange = (field, value) => {
    setDeleteConfirm(prev => ({ ...prev, [field]: value }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // Image/profile picture upload removed per user preference

  const updateProfileHandler = async () => {
    if (!profile.displayName.trim()) {
      setMessage({ type: 'error', text: 'Display name is required' });
      return;
    }

    setLoading(true);
    try {
      const updates = {};
      
      if (profile.displayName !== currentUser.displayName) {
        updates.displayName = profile.displayName;
      }

      // photoURL updates removed - picture option disabled

      if (Object.keys(updates).length > 0) {
        await updateUserProfile(updates);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: `Failed to update profile: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const updateEmailHandler = async () => {
    if (!profile.email.trim()) {
      setMessage({ type: 'error', text: 'Email is required' });
      return;
    }

    if (profile.email === currentUser.email) {
      setMessage({ type: 'info', text: 'Email address is the same as current' });
      return;
    }

    setLoading(true);
    try {
      await updateUserEmail(profile.email);
      setMessage({ type: 'success', text: 'Email updated successfully!' });
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        setMessage({ type: 'error', text: 'Please re-authenticate to change your email address' });
      } else {
        setMessage({ type: 'error', text: `Failed to update email: ${error.message}` });
      }
    } finally {
      setLoading(false);
    }
  };

  const updatePasswordHandler = async () => {
    if (!passwords.currentPassword || !passwords.newPassword) {
      setMessage({ type: 'error', text: 'All password fields are required' });
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwords.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
      return;
    }

    setLoading(true);
    try {
      // Re-authenticate user before password change
      await reauthenticateUser(passwords.currentPassword);
      
      // Update password
      await updateUserPassword(passwords.newPassword);
      
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        setMessage({ type: 'error', text: 'Current password is incorrect' });
      } else {
        setMessage({ type: 'error', text: `Failed to update password: ${error.message}` });
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteAccountHandler = async () => {
    if (deleteConfirm.confirmText !== 'delete my account') {
      setMessage({ type: 'error', text: 'Please type "delete my account" to confirm' });
      return;
    }

    setLoading(true);
    try {
      // Re-authenticate user before deletion
      await reauthenticateUser(deleteConfirm.password);
      
      // Delete user account
      await deleteUserAccount();
      setMessage({ type: 'success', text: 'Account deleted successfully' });
      // User will be automatically logged out
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        setMessage({ type: 'error', text: 'Password is incorrect' });
      } else {
        setMessage({ type: 'error', text: `Failed to delete account: ${error.message}` });
      }
    } finally {
      setLoading(false);
    }
  };

  const clearMessage = () => {
    setMessage({ type: '', text: '' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your account settings and preferences.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['profile', 'security', 'account'].map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeSection === section
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {section === 'profile' && 'Profile Settings'}
              {section === 'security' && 'Security'}
              {section === 'account' && 'Account'}
            </button>
          ))}
        </nav>
      </div>

      {/* Message Display */}
      {message.text && (
        <div
          className={`p-4 rounded-lg border ${
            message.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : message.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}
        >
          <div className="flex justify-between items-center">
            <span>{message.text}</span>
            <button onClick={clearMessage} className="text-gray-500 hover:text-gray-700">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Profile Settings */}
      {activeSection === 'profile' && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
            
            {/* Profile Info */}
            <div className="mb-6">
              <p className="text-sm text-gray-600">Manage your profile information below.</p>
            </div>

            {/* Display Name */}
            <div className="space-y-4">
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                  Display Name
                </label>
                <input
                  type="text"
                  id="displayName"
                  value={profile.displayName}
                  onChange={(e) => handleProfileChange('displayName', e.target.value)}
                  className="input-field mt-1"
                  placeholder="Enter your display name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={profile.email}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                  className="input-field mt-1"
                  placeholder="Enter your email address"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={updateProfileHandler}
                  disabled={loading}
                  className="btn-primary disabled:opacity-50"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Update Profile
                </button>
                <button
                  onClick={updateEmailHandler}
                  disabled={loading || profile.email === currentUser?.email}
                  className="btn-secondary disabled:opacity-50"
                >
                  Update Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Settings */}
      {activeSection === 'security' && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
          <div className="space-y-4">
            {/* Current Password */}
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  id="currentPassword"
                  value={passwords.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                  className="input-field pr-10"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  id="newPassword"
                  value={passwords.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  className="input-field pr-10"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  id="confirmPassword"
                  value={passwords.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  className="input-field pr-10"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              onClick={updatePasswordHandler}
              disabled={loading}
              className="btn-primary disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              Update Password
            </button>
          </div>
        </div>
      )}

      {/* Account Settings */}
      {activeSection === 'account' && (
        <div className="space-y-6">
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

              <div>
                <label className="block text-sm font-medium text-gray-700">Account Created</label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentUser?.metadata?.creationTime ? 
                    new Date(currentUser.metadata.creationTime).toLocaleDateString() : 
                    'Unknown'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="card border-red-200 bg-red-50">
            <h3 className="text-lg font-medium text-red-900 mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Danger Zone
            </h3>
            <div className="space-y-4">
              <p className="text-sm text-red-700">
                Once you delete your account, there is no going back. Please be certain.
              </p>

              <div>
                <label htmlFor="deletePassword" className="block text-sm font-medium text-red-700">
                  Your Password
                </label>
                <input
                  type="password"
                  id="deletePassword"
                  value={deleteConfirm.password}
                  onChange={(e) => handleDeleteChange('password', e.target.value)}
                  className="input-field mt-1 border-red-300"
                  placeholder="Enter your password to confirm"
                />
              </div>

              <div>
                <label htmlFor="confirmText" className="block text-sm font-medium text-red-700">
                  Type "delete my account" to confirm
                </label>
                <input
                  type="text"
                  id="confirmText"
                  value={deleteConfirm.confirmText}
                  onChange={(e) => handleDeleteChange('confirmText', e.target.value)}
                  className="input-field mt-1 border-red-300"
                  placeholder="delete my account"
                />
              </div>

              <button
                onClick={deleteAccountHandler}
                disabled={loading}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* About Section */}
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