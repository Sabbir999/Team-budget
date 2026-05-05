import React from "react";
import { Users, Activity } from "lucide-react";

export default function DashboardStats({ teams = [], players = [] }) {
  const activePlayers = players.filter((player) => player.isActive).length;

  const stats = [
    {
      name: "Active Teams",
      value: teams.length,
      icon: Activity,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      name: "Active Players",
      value: activePlayers,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  return (
    <div className="w-full">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 mb-6 w-full">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.name}
              className="rounded-2xl bg-white shadow-sm border border-gray-100 p-5 flex items-center justify-between transition hover:shadow-md"
            >
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {stat.name}
                </p>
                <h3 className="text-2xl font-semibold text-gray-900 mt-1">
                  {stat.value}
                </h3>
              </div>

              <div
                className={`p-3 rounded-xl ${stat.bgColor} ${stat.color} flex items-center justify-center`}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}