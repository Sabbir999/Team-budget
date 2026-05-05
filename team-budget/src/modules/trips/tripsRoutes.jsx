import React from "react";
import { MapPin } from "lucide-react";

import TripsPage from "./pages/TripsPage";

export const tripsRoutes = [
  {
    name: "Trips",
    path: "trips",
    href: "/trips",
    icon: MapPin,
    element: <TripsPage />,
  },
];
