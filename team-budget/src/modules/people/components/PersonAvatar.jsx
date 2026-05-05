import React from "react";
import { getInitials } from "../utils/peopleHelpers";

const colorClasses = {
  blue: "bg-blue-100 text-blue-700",
  green: "bg-green-100 text-green-700",
  purple: "bg-purple-100 text-purple-700",
  amber: "bg-amber-100 text-amber-700",
  pink: "bg-pink-100 text-pink-700",
  gray: "bg-gray-100 text-gray-700",
};

export default function PersonAvatar({ person, size = "md" }) {
  const sizeClass = size === "lg" ? "h-14 w-14 text-lg" : "h-9 w-9 text-sm";
  const colorClass = colorClasses[person?.avatarColor] || colorClasses.blue;

  return (
    <div
      className={`${sizeClass} flex shrink-0 items-center justify-center rounded-full font-bold ${colorClass}`}
    >
      {getInitials(person?.name)}
    </div>
  );
}
