import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { LogOut, ChevronDown, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { currentUser, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const handleSettingsClick = () => {
    setShowUserMenu(false);
    navigate("/settings");
  };

  const getUserInitials = (email) => {
    return email ? email.charAt(0).toUpperCase() : "U";
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100/80 shadow-sm z-20">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 w-full">
          <div className="flex items-center">

          </div>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu((previous) => !previous)}
              className="flex items-center space-x-3 p-1.5 rounded-xl hover:bg-gray-50/80 transition-all duration-200 border border-transparent hover:border-gray-200/50 group"
            >
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg text-white text-sm font-semibold shadow-sm">
                {getUserInitials(currentUser?.email)}
              </div>

              <div className="hidden sm:flex items-center space-x-2">
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900 leading-none">
                    {currentUser?.displayName || "User"}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {currentUser?.email}
                  </p>
                </div>

                <ChevronDown
                  className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                    showUserMenu ? "rotate-180" : ""
                  }`}
                />
              </div>
            </button>

            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />

                <div className="absolute right-0 top-full mt-2 w-64 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-gray-100/80 py-2 z-20">
                  <div className="px-4 py-3 border-b border-gray-100/50">
                    <p className="text-sm font-semibold text-gray-900">
                      {currentUser?.displayName || "User"}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {currentUser?.email}
                    </p>
                  </div>

                  <div className="py-2">
                    <button
                      onClick={handleSettingsClick}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50/50 transition-colors duration-150"
                    >
                      <Settings className="h-4 w-4 text-gray-400" />
                      <span>Settings</span>
                    </button>
                  </div>

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
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}