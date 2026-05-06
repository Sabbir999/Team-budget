import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  Save,
  X,
  Eye,
  EyeOff,
  Trash2,
  AlertTriangle,
} from "lucide-react";

export default function Settings() {
  const {
    currentUser,
    updateUserProfile,
    updateUserPassword,
    updateUserEmail,
    deleteUserAccount,
    reauthenticateUser,
  } = useAuth();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [activeSection, setActiveSection] = useState("profile");

  const [profile, setProfile] = useState({
    displayName: currentUser?.displayName || "",
    email: currentUser?.email || "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [deleteConfirm, setDeleteConfirm] = useState({
    password: "",
    confirmText: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleProfileChange = (field, value) => {
    setProfile((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswords((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleDeleteChange = (field, value) => {
    setDeleteConfirm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((previous) => ({
      ...previous,
      [field]: !previous[field],
    }));
  };

  const updateProfileHandler = async () => {
    if (!profile.displayName.trim()) {
      setMessage({ type: "error", text: "Display name is required" });
      return;
    }

    setLoading(true);

    try {
      const updates = {};

      if (profile.displayName !== currentUser?.displayName) {
        updates.displayName = profile.displayName;
      }

      if (Object.keys(updates).length > 0) {
        await updateUserProfile(updates);
        setMessage({
          type: "success",
          text: "Profile updated successfully!",
        });
      } else {
        setMessage({
          type: "info",
          text: "No profile changes to update.",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: `Failed to update profile: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateEmailHandler = async () => {
    if (!profile.email.trim()) {
      setMessage({ type: "error", text: "Email is required" });
      return;
    }

    if (profile.email === currentUser?.email) {
      setMessage({
        type: "info",
        text: "Email address is the same as current",
      });
      return;
    }

    setLoading(true);

    try {
      await updateUserEmail(profile.email);
      setMessage({
        type: "success",
        text: "Email updated successfully!",
      });
    } catch (error) {
      if (error.code === "auth/requires-recent-login") {
        setMessage({
          type: "error",
          text: "Please re-authenticate to change your email address",
        });
      } else {
        setMessage({
          type: "error",
          text: `Failed to update email: ${error.message}`,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const updatePasswordHandler = async () => {
    if (!passwords.currentPassword || !passwords.newPassword) {
      setMessage({
        type: "error",
        text: "All password fields are required",
      });
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({
        type: "error",
        text: "New passwords do not match",
      });
      return;
    }

    if (passwords.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters long",
      });
      return;
    }

    setLoading(true);

    try {
      await reauthenticateUser(passwords.currentPassword);
      await updateUserPassword(passwords.newPassword);

      setMessage({
        type: "success",
        text: "Password updated successfully!",
      });

      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        setMessage({
          type: "error",
          text: "Current password is incorrect",
        });
      } else {
        setMessage({
          type: "error",
          text: `Failed to update password: ${error.message}`,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteAccountHandler = async () => {
    if (deleteConfirm.confirmText !== "delete my account") {
      setMessage({
        type: "error",
        text: 'Please type "delete my account" to confirm',
      });
      return;
    }

    if (!deleteConfirm.password) {
      setMessage({
        type: "error",
        text: "Password is required to delete your account",
      });
      return;
    }

    setLoading(true);

    try {
      await reauthenticateUser(deleteConfirm.password);
      await deleteUserAccount();

      setMessage({
        type: "success",
        text: "Account deleted successfully",
      });
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        setMessage({
          type: "error",
          text: "Password is incorrect",
        });
      } else {
        setMessage({
          type: "error",
          text: `Failed to delete account: ${error.message}`,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const clearMessage = () => {
    setMessage({ type: "", text: "" });
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
          {["profile", "security", "account"].map((section) => (
            <button
              key={section}
              type="button"
              onClick={() => setActiveSection(section)}
              className={`border-b-2 px-1 py-2 text-sm font-medium capitalize ${
                activeSection === section
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {section === "profile" && "Profile Settings"}
              {section === "security" && "Security"}
              {section === "account" && "Account"}
            </button>
          ))}
        </nav>
      </div>

      {/* Message Display */}
      {message.text && (
        <div
          className={`rounded-lg border p-4 ${
            message.type === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : message.type === "error"
                ? "border-red-200 bg-red-50 text-red-800"
                : "border-blue-200 bg-blue-50 text-blue-800"
          }`}
        >
          <div className="flex items-center justify-between">
            <span>{message.text}</span>

            <button
              type="button"
              onClick={clearMessage}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Profile Settings */}
      {activeSection === "profile" && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              Profile Information
            </h3>

            <div className="mb-6">
              <p className="text-sm text-gray-600">
                Manage your profile information below.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="displayName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Display Name
                </label>

                <input
                  type="text"
                  id="displayName"
                  value={profile.displayName}
                  onChange={(event) =>
                    handleProfileChange("displayName", event.target.value)
                  }
                  className="input-field mt-1"
                  placeholder="Enter your display name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>

                <input
                  type="email"
                  id="email"
                  value={profile.email}
                  onChange={(event) =>
                    handleProfileChange("email", event.target.value)
                  }
                  className="input-field mt-1"
                  placeholder="Enter your email address"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={updateProfileHandler}
                  disabled={loading}
                  className="btn-primary disabled:opacity-50"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Update Profile
                </button>

                <button
                  type="button"
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
      {activeSection === "security" && (
        <div className="card">
          <h3 className="mb-4 text-lg font-medium text-gray-900">
            Change Password
          </h3>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Current Password
              </label>

              <div className="relative mt-1">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  id="currentPassword"
                  value={passwords.currentPassword}
                  onChange={(event) =>
                    handlePasswordChange(
                      "currentPassword",
                      event.target.value
                    )
                  }
                  className="input-field pr-10"
                  placeholder="Enter current password"
                />

                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.current ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>

              <div className="relative mt-1">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  id="newPassword"
                  value={passwords.newPassword}
                  onChange={(event) =>
                    handlePasswordChange("newPassword", event.target.value)
                  }
                  className="input-field pr-10"
                  placeholder="Enter new password"
                />

                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.new ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm New Password
              </label>

              <div className="relative mt-1">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  id="confirmPassword"
                  value={passwords.confirmPassword}
                  onChange={(event) =>
                    handlePasswordChange(
                      "confirmPassword",
                      event.target.value
                    )
                  }
                  className="input-field pr-10"
                  placeholder="Confirm new password"
                />

                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={updatePasswordHandler}
              disabled={loading}
              className="btn-primary disabled:opacity-50"
            >
              <Save className="mr-2 h-4 w-4" />
              Update Password
            </button>
          </div>
        </div>
      )}

      {/* Account Settings */}
      {activeSection === "account" && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              Account Information
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentUser?.email}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  User ID
                </label>
                <p className="mt-1 font-mono text-sm text-gray-900">
                  {currentUser?.uid}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Account Created
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentUser?.metadata?.creationTime
                    ? new Date(
                        currentUser.metadata.creationTime
                      ).toLocaleDateString()
                    : "Unknown"}
                </p>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="card border-red-200 bg-red-50">
            <h3 className="mb-4 flex items-center text-lg font-medium text-red-900">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Danger Zone
            </h3>

            <div className="space-y-4">
              <p className="text-sm text-red-700">
                Once you delete your account, there is no going back. Please be
                certain.
              </p>

              <div>
                <label
                  htmlFor="deletePassword"
                  className="block text-sm font-medium text-red-700"
                >
                  Your Password
                </label>

                <input
                  type="password"
                  id="deletePassword"
                  value={deleteConfirm.password}
                  onChange={(event) =>
                    handleDeleteChange("password", event.target.value)
                  }
                  className="input-field mt-1 border-red-300"
                  placeholder="Enter your password to confirm"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmText"
                  className="block text-sm font-medium text-red-700"
                >
                  Type "delete my account" to confirm
                </label>

                <input
                  type="text"
                  id="confirmText"
                  value={deleteConfirm.confirmText}
                  onChange={(event) =>
                    handleDeleteChange("confirmText", event.target.value)
                  }
                  className="input-field mt-1 border-red-300"
                  placeholder="delete my account"
                />
              </div>

              <button
                type="button"
                onClick={deleteAccountHandler}
                disabled={loading}
                className="flex items-center rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* About Section */}
      <div className="card">
        <h3 className="mb-4 text-lg font-medium text-gray-900">
          About LifeStack Hub
        </h3>

        <div className="space-y-3 text-sm text-gray-600">
          <p>
            LifeStack Hub is a simple way to organize real life in one place.
            Instead of jumping between different apps, spreadsheets, notes, and
            group chats, LifeStack helps you manage the people, plans, money,
            and updates that matter most.
          </p>

          <p>
            The goal is simple: enter the information once and get a clean,
            useful result that makes sense to anyone.
          </p>

          <p className="font-medium text-gray-700">Features include:</p>

          <ul className="ml-4 list-inside list-disc space-y-1">
            <li>Reusable people profiles across modules</li>
            <li>
              Sports teams with members, expenses, payments, and balances
            </li>
            <li>Trip planning with shared expense tracking</li>
            <li>Payment records and settlement summaries</li>
            <li>Blog posts, updates, and public sharing</li>
            <li>Real-time data synchronization</li>
          </ul>
        </div>
      </div>
    </div>
  );
}