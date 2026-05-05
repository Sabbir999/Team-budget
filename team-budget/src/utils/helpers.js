// src/utils/helpers.js

export function formatCurrency(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(Number(amount) || 0);
}

export function formatDate(timestamp, options = {}) {
  if (!timestamp) {
    return "N/A";
  }

  const defaultOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return date.toLocaleDateString("en-US", {
    ...defaultOptions,
    ...options,
  });
}

export function formatDateTime(timestamp) {
  if (!timestamp) {
    return "N/A";
  }

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getInitials(name) {
  if (!name) {
    return "?";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);
}

export function debounce(func, wait = 300) {
  let timeout;

  return function executedFunction(...args) {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

export function isValidEmail(email) {
  if (!email) {
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(String(email).trim());
}

export function generateId() {
  return `${Date.now().toString(36)}${Math.random()
    .toString(36)
    .slice(2)}`;
}

export function sortByProperty(array = [], property, ascending = true) {
  return [...array].sort((a, b) => {
    const aVal = a[property];
    const bVal = b[property];

    if (aVal < bVal) {
      return ascending ? -1 : 1;
    }

    if (aVal > bVal) {
      return ascending ? 1 : -1;
    }

    return 0;
  });
}

export function groupBy(array = [], property) {
  return array.reduce((groups, item) => {
    const key = item[property] || "unknown";

    if (!groups[key]) {
      groups[key] = [];
    }

    groups[key].push(item);

    return groups;
  }, {});
}