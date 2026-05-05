import React from "react";
import { Trophy } from "lucide-react";

import SportsDashboard from "./pages/SportsDashboard.jsx";

export const sportsRoutes = [
  {
    name: "Sports Dashboard",
    path: "sports",
    href: "/sports",
    icon: Trophy,
    element: <SportsDashboard />,
  },
];

export default sportsRoutes;
