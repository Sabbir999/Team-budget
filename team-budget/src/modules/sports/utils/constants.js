export const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "CAD", symbol: "$", name: "Canadian Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "AUD", symbol: "$", name: "Australian Dollar" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
];

export const PAYMENT_METHODS = [
  { value: "zelle", label: "Zelle" },
  { value: "venmo", label: "Venmo" },
  { value: "paypal", label: "PayPal" },
  { value: "cash", label: "Cash" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "other", label: "Other" },
];

export const PAYMENT_STATUSES = [
  { value: "paid", label: "Paid", color: "success" },
  { value: "pending", label: "Pending", color: "warning" },
  { value: "partial", label: "Partial", color: "danger" },
  { value: "unpaid", label: "Unpaid", color: "danger" },
];

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const DEFAULT_TEAM_SETTINGS = {
  currency: "USD",
  paymentMethod: "zelle",
};

export const EXPENSE_CATEGORIES = [
  { key: "venue", label: "Venue" },
  { key: "equipment", label: "Equipment" },
  { key: "tournament", label: "Tournament" },
  { key: "uniform", label: "Uniform" },
  { key: "other", label: "Other" },
];
