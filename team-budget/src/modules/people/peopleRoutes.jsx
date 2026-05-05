import React from "react";
import { Users } from "lucide-react";

import PeoplePage from "./pages/PeoplePage";

export const peopleRoutes = [
  {
    name: "People",
    path: "people",
    href: "/people",
    icon: Users,
    element: <PeoplePage />,
  },
];
