import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Settings,
  PanelLeft,
  PanelLeftClose,
  Trophy,
  MapPin,
  Users,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import logo from "../../assets/logo.png";
import { sportsRoutes } from "../../modules/sports/sportsRoutes";
import { tripsRoutes } from "../../modules/trips/tripsRoutes";
import { peopleRoutes } from "../../modules/people/peopleRoutes";

const navigation = [
  {
    name: "Dashboard",
    href: "/sports",
    icon: Home,
  },
  {
    name: "People",
    icon: Users,
    children: peopleRoutes,
  },
  {
    name: "SPORTS",
    icon: Trophy,
    children: sportsRoutes,
  },
  {
    name: "Travel",
    icon: MapPin,
    children: tripsRoutes,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar({ isOpen, onToggle }) {
  const location = useLocation();

  const [openSections, setOpenSections] = useState({
    People: true,
    Sports: true,
    Trips: true,
  });

  const isActive = (href) => {
    if (href === "/sports") {
      return location.pathname === "/sports";
    }

    return location.pathname === href || location.pathname.startsWith(`${href}/`);
  };

  const isSectionActive = (item) => {
    if (!item.children) {
      return false;
    }

    return item.children.some((child) => isActive(child.href));
  };

  const toggleSection = (sectionName) => {
    setOpenSections((previous) => ({
      ...previous,
      [sectionName]: !previous[sectionName],
    }));
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-20 md:hidden"
          onClick={onToggle}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-30 bg-white border-r border-gray-200/80 transition-all duration-300 ease-in-out ${
          isOpen
            ? "w-64 translate-x-0"
            : "w-0 -translate-x-full md:translate-x-0 md:w-0"
        }`}
      >
        <div
          className={`flex flex-col h-full transition-opacity duration-200 ${
            isOpen ? "opacity-100" : "opacity-0 md:opacity-0"
          }`}
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm overflow-hidden">
                <img
                  src={logo}
                  alt="LifeStack"
                  className="h-5 w-5 object-contain"
                />
              </div>

              <h1 className="text-xl font-bold text-gray-900">LifeStack</h1>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;

              if (item.children) {
                const sectionOpen = openSections[item.name];
                const sectionActive = isSectionActive(item);

                return (
                  <div key={item.name} className="space-y-1">
                    <button
                      type="button"
                      onClick={() => toggleSection(item.name)}
                      className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                        sectionActive
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <span className="flex items-center">
                        <Icon
                          className={`mr-3 h-5 w-5 transition-colors ${
                            sectionActive
                              ? "text-blue-600"
                              : "text-gray-400 group-hover:text-gray-600"
                          }`}
                        />
                        {item.name}
                      </span>

                      {sectionOpen ? (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      )}
                    </button>

                    {sectionOpen && (
                      <div className="ml-8 space-y-1">
                        {item.children.map((child) => {
                          const ChildIcon = child.icon;
                          const childActive = isActive(child.href);

                          return (
                            <Link
                              key={child.path}
                              to={child.href}
                              className={`group flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                                childActive
                                  ? "bg-blue-50 text-blue-700"
                                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                              }`}
                            >
                              <ChildIcon
                                className={`mr-3 h-4 w-4 transition-colors ${
                                  childActive
                                    ? "text-blue-600"
                                    : "text-gray-400 group-hover:text-gray-600"
                                }`}
                              />

                              <span>{child.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              const active = isActive(item.href);

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    active
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon
                    className={`mr-3 h-5 w-5 transition-colors ${
                      active
                        ? "text-blue-600"
                        : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  />

                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {!isOpen && (
        <div className="fixed top-3 z-40 left-3 p-1 bg-white rounded-md shadow-sm">
          <img
            src={logo}
            alt="LifeStack logo"
            className="h-8 w-8 object-contain block"
          />
        </div>
      )}

      <button
        onClick={onToggle}
        className={`fixed top-3 z-40 p-2 rounded-lg bg-white border border-gray-200/80 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-300 ease-in-out shadow-sm hover:shadow-md ${
          isOpen ? "left-[240px]" : "left-16"
        }`}
        title={isOpen ? "Close sidebar" : "Open sidebar"}
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