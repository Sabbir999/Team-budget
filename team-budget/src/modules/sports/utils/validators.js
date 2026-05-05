const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]?[1-9]\d{0,15}$/;

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

  if (!teamData.currency) {
    errors.currency = "Currency is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateTeamMember(memberData = {}) {
  const errors = {};

  if (!memberData.personId) {
    errors.personId = "Person is required";
  }

  if (memberData.shareWeight !== undefined && Number(memberData.shareWeight) < 0) {
    errors.shareWeight = "Share weight cannot be negative";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateExpense(expenseData = {}) {
  const errors = {};

  if (!expenseData.title?.trim()) {
    errors.title = "Expense title is required";
  }

  if (!expenseData.month) {
    errors.month = "Month is required";
  }

  if (!expenseData.year) {
    errors.year = "Year is required";
  }

  const amount = Number(expenseData.amount ?? expenseData.total);

  if (!Number.isFinite(amount) || amount <= 0) {
    errors.amount = "Amount must be greater than 0";
  }

  if (Number(expenseData.membersCount ?? 0) < 0) {
    errors.membersCount = "Number of members cannot be negative";
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

  if (!paymentData.personId && !paymentData.playerId) {
    errors.personId = "Member is required";
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
