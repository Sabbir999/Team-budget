import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Settings,
  PanelLeft,
  PanelLeftClose,
  Trophy,
  MapPin,
  Users,
  BookOpen,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import logo from "../../assets/logo.png";
import { sportsRoutes } from "../../modules/sports/sportsRoutes";
import { tripsRoutes } from "../../modules/trips/tripsRoutes";
import { peopleRoutes } from "../../modules/people/peopleRoutes";
import { blogRoutes } from "../../modules/blog/blogRoutes";

const visibleBlogRoutes = blogRoutes.filter((route) => route.href);

const visibleSportsRoutes = sportsRoutes
  .filter((route) => route.href === "/sports")
  .map((route) => ({
    ...route,
    name: "Sports Dashboard",
  }));

const visibleTripsRoutes = tripsRoutes
  .filter((route) => route.href === "/trips")
  .map((route) => ({
    ...route,
    name: "Trips Dashboard",
  }));

const visiblePeopleRoutes = peopleRoutes.filter((route) => route.href);

const navigation = [
  {
    name: "Blog",
    icon: BookOpen,
    children: visibleBlogRoutes,
  },
  {
    name: "Sports",
    icon: Trophy,
    children: visibleSportsRoutes,
  },
  {
    name: "Travel",
    icon: MapPin,
    children: visibleTripsRoutes,
  },
  {
    name: "People",
    icon: Users,
    children: visiblePeopleRoutes,
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
    Blog: true,
    Sports: true,
    Travel: true,
    People: true,
  });

  const isActive = (href) => {
    if (!href) {
      return false;
    }

    return location.pathname === href || location.pathname.startsWith(`${href}/`);
  };

  const isSectionActive = (children = []) => {
    return children.some((child) => isActive(child.href));
  };

  const toggleSection = (sectionName) => {
    setOpenSections((previous) => ({
      ...previous,
      [sectionName]: !previous[sectionName],
    }));
  };

  const renderSection = (item) => {
    const Icon = item.icon;
    const sectionOpen = openSections[item.name];
    const sectionActive = isSectionActive(item.children);

    if (!item.children?.length) {
      return null;
    }

    return (
      <div key={item.name} className="space-y-1">
        <button
          type="button"
          onClick={() => toggleSection(item.name)}
          className={`group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
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
                  key={child.href}
                  to={child.href}
                  className={`group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 ${
                    childActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {ChildIcon && (
                    <ChildIcon
                      className={`mr-3 h-4 w-4 transition-colors ${
                        childActive
                          ? "text-blue-600"
                          : "text-gray-400 group-hover:text-gray-600"
                      }`}
                    />
                  )}

                  <span>{child.name}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderLink = (item) => {
    const Icon = item.icon;
    const active = isActive(item.href);

    return (
      <Link
        key={item.href}
        to={item.href}
        className={`group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
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
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-gray-900/20 backdrop-blur-sm md:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 border-r border-gray-200/80 bg-white transition-all duration-300 ease-in-out ${
          isOpen
            ? "w-64 translate-x-0"
            : "w-0 -translate-x-full md:w-0 md:translate-x-0"
        }`}
      >
        <div
          className={`flex h-full flex-col transition-opacity duration-200 ${
            isOpen ? "opacity-100" : "opacity-0 md:opacity-0"
          }`}
        >
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 shadow-sm">
                <img
                  src={logo}
                  alt="LifeStack"
                  className="h-5 w-5 object-contain"
                />
              </div>

              <h1 className="text-xl font-bold text-gray-900">LifeStack</h1>
            </div>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
            {navigation.map((item) =>
              item.children ? renderSection(item) : renderLink(item)
            )}
          </nav>
        </div>
      </aside>

      {!isOpen && (
        <div className="fixed left-3 top-3 z-40 rounded-md bg-white p-1 shadow-sm">
          <img
            src={logo}
            alt="LifeStack logo"
            className="block h-8 w-8 object-contain"
          />
        </div>
      )}

      <button
        type="button"
        onClick={onToggle}
        className={`fixed top-3 z-40 rounded-lg border border-gray-200/80 bg-white p-2 text-gray-600 shadow-sm transition-all duration-300 ease-in-out hover:bg-gray-50 hover:text-gray-900 hover:shadow-md ${
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