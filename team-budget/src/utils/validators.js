// Validation functions

export function validateTeam(teamData) {
  const errors = {};

  if (!teamData.name?.trim()) {
    errors.name = 'Team name is required';
  } else if (teamData.name.length < 2) {
    errors.name = 'Team name must be at least 2 characters';
  }

  if (!teamData.sportType) {
    errors.sportType = 'Sport type is required';
  }

  if (!teamData.currency) {
    errors.currency = 'Currency is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validatePlayer(playerData) {
  const errors = {};

  if (!playerData.name?.trim()) {
    errors.name = 'Player name is required';
  } else if (playerData.name.length < 2) {
    errors.name = 'Player name must be at least 2 characters';
  }

  if (playerData.email && !isValidEmail(playerData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validateExpense(expenseData) {
  const errors = {};

  if (!expenseData.month) {
    errors.month = 'Month is required';
  }

  if (!expenseData.year) {
    errors.year = 'Year is required';
  } else if (expenseData.year < 2020 || expenseData.year > 2030) {
    errors.year = 'Please enter a valid year';
  }

  const total = (expenseData.indoor || 0) + 
                (expenseData.shuttlecock || 0) + 
                (expenseData.equipment || 0) + 
                (expenseData.other || 0);

  if (total <= 0) {
    errors.total = 'At least one expense amount must be greater than 0';
  }

  if (expenseData.playersCount < 0) {
    errors.playersCount = 'Number of players cannot be negative';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validatePayment(paymentData) {
  const errors = {};

  if (!paymentData.month) {
    errors.month = 'Month is required';
  }

  if (!paymentData.year) {
    errors.year = 'Year is required';
  }

  if (!paymentData.playerId) {
    errors.playerId = 'Player is required';
  }

  if (!paymentData.amount || paymentData.amount <= 0) {
    errors.amount = 'Amount must be greater than 0';
  }

  if (!paymentData.status) {
    errors.status = 'Status is required';
  }

  if (!paymentData.paymentMethod) {
    errors.paymentMethod = 'Payment method is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

// Reusable validators
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone) {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return !phone || phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

export function isValidAmount(amount) {
  return amount !== null && amount !== undefined && amount >= 0;
}

export function isPositiveNumber(value) {
  return !isNaN(value) && Number(value) >= 0;
}