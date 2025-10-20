// Application constants

export const SPORT_TYPES = [
  'badminton',
  'basketball',
  'soccer',
  'volleyball',
  'tennis',
  'hockey',
  'baseball',
  'football',
  'cricket',
  'rugby',
  'other'
];

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'CAD', symbol: '$', name: 'Canadian Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'AUD', symbol: '$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' }
];

export const PAYMENT_METHODS = [
  { value: 'zelle', label: 'Zelle' },
  { value: 'venmo', label: 'Venmo' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'cash', label: 'Cash' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'other', label: 'Other' }
];

export const PAYMENT_STATUSES = [
  { value: 'paid', label: 'Paid', color: 'success' },
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'partial', label: 'Partial', color: 'danger' }
];

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const SHUTTLECOCK_TYPES = [
  'Not played',
  'Aero & Ling',
  'Yonex',
  'Victor',
  'Li-Ning',
  'Other'
];

// Default team settings
export const DEFAULT_TEAM_SETTINGS = {
  currency: 'USD',
  sportType: 'badminton',
  paymentMethod: 'zelle'
};

// Expense categories
export const EXPENSE_CATEGORIES = [
  { key: 'indoor', label: 'Indoor Court Fee', description: 'Court rental fees' },
  { key: 'shuttlecock', label: 'Shuttlecock Cost', description: 'Shuttlecock purchases' },
  { key: 'equipment', label: 'Equipment Cost', description: 'Rackets, nets, other equipment' },
  { key: 'other', label: 'Other Expenses', description: 'Miscellaneous expenses' }
];

// Database paths
export const DB_PATHS = {
  USERS: 'users',
  TEAMS: 'teams',
  PLAYERS: 'players',
  EXPENSES: 'expenses',
  PAYMENTS: 'payments',
  ATTENDANCE: 'attendance',
  SETTINGS: 'settings'
};