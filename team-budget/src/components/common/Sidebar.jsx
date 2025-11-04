import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  DollarSign, 
  CreditCard, 
  Activity,
  Settings,
  PanelLeft,
  PanelLeftClose
} from 'lucide-react';
import logo from '../../assets/logo.png';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Teams', href: '/teams', icon: Activity },
  { name: 'Players', href: '/players', icon: Users },
  { name: 'Expenses', href: '/expenses', icon: DollarSign },
  { name: 'Payments', href: '/payments', icon: CreditCard },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar({ isOpen, onToggle }) {
  const location = useLocation();

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-20 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 bg-white border-r border-gray-200/80 transition-all duration-300 ease-in-out ${
        isOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full md:translate-x-0 md:w-0'
      }`}>
        <div className={`flex flex-col h-full transition-opacity duration-200 ${
          isOpen ? 'opacity-100' : 'opacity-0 md:opacity-0'
        }`}>
          {/* Logo Section */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm overflow-hidden">
                <img src={logo} alt="TeamBudget" className="h-5 w-5 object-contain" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">TeamBudget</h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon
                    className={`mr-3 h-5 w-5 transition-colors ${
                      isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                    }`}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Floating logo visible only when sidebar is closed (to the right of the toggle) */}
      {!isOpen && (
        <div className="fixed top-3 z-40 left-3 p-1 bg-white rounded-md shadow-sm">
          <img src={logo} alt="logo" className="h-8 w-8 object-contain block" />
        </div>
      )}

      {/* Toggle Button - Claude Style */}
      <button
        onClick={onToggle}
        className={`fixed top-3 z-40 p-2 rounded-lg bg-white border border-gray-200/80 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-300 ease-in-out shadow-sm hover:shadow-md ${
          isOpen ? 'left-[240px]' : 'left-16'
        }`}
        title={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isOpen ? (
          <PanelLeftClose className="h-6 w-6" />
        ) : (
          <PanelLeft className="h-6 w-6" />
        )}
      </button>
    </>
  );
}