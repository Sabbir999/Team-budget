// Utility helper functions

// Format currency based on currency code
export function formatCurrency(amount, currency = 'USD') {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  });
  
  return formatter.format(amount || 0);
}

// Format date
export function formatDate(timestamp, options = {}) {
  if (!timestamp) return 'N/A';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { ...defaultOptions, ...options });
}

// Format date and time
export function formatDateTime(timestamp) {
  if (!timestamp) return 'N/A';
  
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Calculate player balance
export function calculatePlayerBalance(playerId, expenses, payments) {
  let totalDue = 0;
  let totalPaid = 0;

  expenses.forEach(expense => {
    if (expense.playersCount > 0) {
      totalDue += expense.total / expense.playersCount;
    }
  });

  payments.forEach(payment => {
    if (payment.playerId === playerId) {
      totalPaid += payment.amount || 0;
    }
  });

  const balance = totalPaid - totalDue;
  
  return {
    totalDue,
    totalPaid,
    balance,
    status: balance >= 0 ? 'paid' : balance < 0 ? 'unpaid' : 'even'
  };
}

// Calculate team financial summary
export function calculateTeamFinancials(expenses, payments) {
  const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.total || 0), 0);
  const totalCollected = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
  const outstanding = totalExpenses - totalCollected;
  const collectionRate = totalExpenses > 0 ? (totalCollected / totalExpenses) * 100 : 0;

  return {
    totalExpenses,
    totalCollected,
    outstanding,
    collectionRate: Math.round(collectionRate * 100) / 100
  };
}

// Filter expenses by month and year
export function filterExpensesByPeriod(expenses, month, year) {
  return expenses.filter(expense => 
    expense.month === month && expense.year === year
  );
}

// Filter payments by month and year
export function filterPaymentsByPeriod(payments, month, year) {
  return payments.filter(payment => 
    payment.month === month && payment.year === year
  );
}

// Get player name by ID
export function getPlayerName(players, playerId) {
  const player = players.find(p => p.id === playerId);
  return player ? player.name : 'Unknown Player';
}

// Generate initials from name
export function getInitials(name) {
  if (!name) return '?';
  
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
}

// Debounce function for search inputs
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Validate email format
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Generate random ID (fallback for when push keys aren't available)
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Sort array by property
export function sortByProperty(array, property, ascending = true) {
  return [...array].sort((a, b) => {
    const aVal = a[property];
    const bVal = b[property];
    
    if (aVal < bVal) return ascending ? -1 : 1;
    if (aVal > bVal) return ascending ? 1 : -1;
    return 0;
  });
}

// Group data by property
export function groupBy(array, property) {
  return array.reduce((groups, item) => {
    const key = item[property];
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {});
}