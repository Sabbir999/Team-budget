import React from "react";
import { Activity, Users } from "lucide-react";

export default function DashboardStats({ teams = [] }) {
  const memberCount = teams.reduce((sum, team) => sum + (team.members?.filter((member) => member.isActive !== false).length || 0), 0);

  const stats = [
    {
      name: "Active Teams",
      value: teams.length,
      icon: Activity,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      name: "Team Members",
      value: memberCount,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  return (
    <div className="w-full">
      <div className="mb-6 grid w-full gap-6 sm:grid-cols-2">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div key={stat.name} className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <h3 className="mt-1 text-2xl font-semibold text-gray-900">{stat.value}</h3>
              </div>
              <div className={`flex items-center justify-center rounded-xl p-3 ${stat.bgColor} ${stat.color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
