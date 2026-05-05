const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]?[1-9]\d{0,15}$/;

const getNumber = (value) => Number(value) || 0;

export function isValidEmail(email) {
  if (!email) {
    return true;
  }

  return EMAIL_REGEX.test(String(email).trim());
}

export function isValidPhone(phone) {
  if (!phone) {
    return true;
  }

  const cleanedPhone = String(phone).replace(/[\s\-()]/g, "");

  return PHONE_REGEX.test(cleanedPhone);
}

export function isValidAmount(amount) {
  const numberAmount = Number(amount);

  return Number.isFinite(numberAmount) && numberAmount >= 0;
}

export function isPositiveNumber(value) {
  const numberValue = Number(value);

  return Number.isFinite(numberValue) && numberValue >= 0;
}

export function validateTeam(teamData = {}) {
  const errors = {};

  const name = teamData.name?.trim();

  if (!name) {
    errors.name = "Team name is required";
  } else if (name.length < 2) {
    errors.name = "Team name must be at least 2 characters";
  }

  if (!teamData.sportType) {
    errors.sportType = "Sport type is required";
  }

  if (!teamData.currency) {
    errors.currency = "Currency is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validatePlayer(playerData = {}) {
  const errors = {};

  const name = playerData.name?.trim();

  if (!name) {
    errors.name = "Player name is required";
  } else if (name.length < 2) {
    errors.name = "Player name must be at least 2 characters";
  }

  if (playerData.email && !isValidEmail(playerData.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (playerData.phone && !isValidPhone(playerData.phone)) {
    errors.phone = "Please enter a valid phone number";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateExpense(expenseData = {}) {
  const errors = {};

  if (!expenseData.month) {
    errors.month = "Month is required";
  }

  if (!expenseData.year) {
    errors.year = "Year is required";
  } else {
    const year = Number(expenseData.year);

    if (!Number.isInteger(year) || year < 2020 || year > 2030) {
      errors.year = "Please enter a valid year";
    }
  }

  const total =
    getNumber(expenseData.indoor) +
    getNumber(expenseData.shuttlecock) +
    getNumber(expenseData.equipment) +
    getNumber(expenseData.other);

  if (total <= 0) {
    errors.total = "At least one expense amount must be greater than 0";
  }

  if (getNumber(expenseData.playersCount) < 0) {
    errors.playersCount = "Number of players cannot be negative";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validatePayment(paymentData = {}) {
  const errors = {};

  if (!paymentData.month) {
    errors.month = "Month is required";
  }

  if (!paymentData.year) {
    errors.year = "Year is required";
  }

  if (!paymentData.playerId) {
    errors.playerId = "Player is required";
  }

  const amount = Number(paymentData.amount);

  if (!Number.isFinite(amount) || amount <= 0) {
    errors.amount = "Amount must be greater than 0";
  }

  if (!paymentData.status) {
    errors.status = "Status is required";
  }

  if (!paymentData.paymentMethod) {
    errors.paymentMethod = "Payment method is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}