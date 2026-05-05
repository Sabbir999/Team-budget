export const DEFAULT_TRIP_CATEGORIES = [
  { id: "airbnb", key: "airbnb", name: "Airbnb", color: "blue", custom: false },
  { id: "car", key: "car", name: "Car rental", color: "slate", custom: false },
  { id: "gas", key: "gas", name: "Gas", color: "amber", custom: false },
  { id: "food", key: "food", name: "Food", color: "green", custom: false },
  { id: "drinks", key: "drinks", name: "Drinks", color: "pink", custom: false },
  { id: "activities", key: "activities", name: "Activities", color: "purple", custom: false },
  { id: "other", key: "other", name: "Other", color: "gray", custom: false },
];

export const CATEGORY_COLORS = {
  blue: { dot: "bg-blue-400", badge: "bg-blue-100 text-blue-700", bar: "bg-blue-500" },
  slate: { dot: "bg-slate-400", badge: "bg-slate-100 text-slate-700", bar: "bg-slate-500" },
  amber: { dot: "bg-amber-400", badge: "bg-amber-100 text-amber-700", bar: "bg-amber-500" },
  green: { dot: "bg-emerald-400", badge: "bg-emerald-100 text-emerald-700", bar: "bg-emerald-500" },
  pink: { dot: "bg-pink-400", badge: "bg-pink-100 text-pink-700", bar: "bg-pink-500" },
  purple: { dot: "bg-violet-400", badge: "bg-violet-100 text-violet-700", bar: "bg-violet-500" },
  gray: { dot: "bg-gray-400", badge: "bg-gray-100 text-gray-700", bar: "bg-gray-500" },
};

export function getTripCategories(trip) {
  return [...DEFAULT_TRIP_CATEGORIES, ...(trip?.customCategories || [])];
}

export function getCategoryByKey(trip, categoryKey) {
  return (
    getTripCategories(trip).find((category) => category.key === categoryKey) ||
    DEFAULT_TRIP_CATEGORIES.find((category) => category.key === "other")
  );
}

export function getCategoryColor(category) {
  return CATEGORY_COLORS[category?.color] || CATEGORY_COLORS.gray;
}
