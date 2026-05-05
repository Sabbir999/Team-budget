import React from "react";
import {
  Home,
  Users,
  DollarSign,
  CreditCard,
  Activity,
} from "lucide-react";

import SportsDashboard from "./pages/SportsDashboard";
import TeamsPage from "./pages/TeamsPage";
import PlayersPage from "./pages/PlayersPage";
import SportsExpensesPage from "./pages/SportsExpensesPage";
import PaymentsPage from "./pages/PaymentsPage";

export const sportsRoutes = [
  {
    name: "Sports Dashboard",
    path: "sports",
    href: "/sports",
    icon: Home,
    element: <SportsDashboard />,
  },
  {
    name: "Teams",
    path: "sports/teams",
    href: "/sports/teams",
    icon: Activity,
    element: <TeamsPage />,
  },
  {
    name: "Players",
    path: "sports/players",
    href: "/sports/players",
    icon: Users,
    element: <PlayersPage />,
  },
  {
    name: "Expenses",
    path: "sports/expenses",
    href: "/sports/expenses",
    icon: DollarSign,
    element: <SportsExpensesPage />,
  },
  {
    name: "Payments",
    path: "sports/payments",
    href: "/sports/payments",
    icon: CreditCard,
    element: <PaymentsPage />,
  },
];