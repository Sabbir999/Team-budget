import React from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  CreditCard,
  Target,
  Percent,
} from "lucide-react";

const getPersonId = (value) => {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  return (
    value.personId ||
    value.memberId ||
    value.playerId ||
    value.id ||
    value.uid ||
    value.name ||
    ""
  );
};

const getExpenseAmount = (expense) => {
  return Number(expense.total ?? expense.amount ?? expense.cost ?? 0) || 0;
};

const getExpensePayerId = (expense) => {
  return (
    getPersonId(expense.paidBy) ||
    getPersonId(expense.paidByPersonId) ||
    getPersonId(expense.paidById) ||
    getPersonId(expense.payerId)
  );
};

const getSplitMemberIds = (expense) => {
  const splitBetween =
    expense.splitBetween ||
    expense.splitMembers ||
    expense.memberIds ||
    expense.members ||
    [];

  if (Array.isArray(splitBetween) && splitBetween.length > 0) {
    return splitBetween.map(getPersonId).filter(Boolean);
  }

  return [];
};

const getPaymentFromId = (payment) => {
  return (
    getPersonId(payment.fromPersonId) ||
    getPersonId(payment.fromMemberId) ||
    getPersonId(payment.fromId) ||
    getPersonId(payment.payerId) ||
    getPersonId(payment.paidBy)
  );
};

const getPaymentToId = (payment) => {
  return (
    getPersonId(payment.toPersonId) ||
    getPersonId(payment.toMemberId) ||
    getPersonId(payment.toId) ||
    getPersonId(payment.receiverId) ||
    getPersonId(payment.paidTo)
  );
};

const roundMoney = (amount) => Math.round((Number(amount) || 0) * 100) / 100;

const formatMoney = (amount) => {
  return `$${roundMoney(amount).toFixed(2)}`;
};

const buildBalances = (expenses = [], payments = []) => {
  const balances = {};

  expenses.forEach((expense) => {
    const amount = getExpenseAmount(expense);
    const payerId = getExpensePayerId(expense);
    const splitMemberIds = getSplitMemberIds(expense);

    if (!amount || !payerId || splitMemberIds.length === 0) {
      return;
    }

    const share = amount / splitMemberIds.length;

    balances[payerId] = (balances[payerId] || 0) + amount;

    splitMemberIds.forEach((memberId) => {
      balances[memberId] = (balances[memberId] || 0) - share;
    });
  });

  payments.forEach((payment) => {
    const amount = Number(payment.amount) || 0;
    const fromId = getPaymentFromId(payment);
    const toId = getPaymentToId(payment);

    if (!amount || !fromId || !toId) {
      return;
    }

    balances[fromId] = (balances[fromId] || 0) + amount;
    balances[toId] = (balances[toId] || 0) - amount;
  });

  return balances;
};

const getAmountDueFromBalances = (balances) => {
  return Object.values(balances).reduce((total, balance) => {
    if (balance < -0.01) {
      return total + Math.abs(balance);
    }

    return total;
  }, 0);
};

const getOriginalAmountDue = (expenses = []) => {
  const balancesBeforePayments = buildBalances(expenses, []);
  return getAmountDueFromBalances(balancesBeforePayments);
};

const getProgressText = (collectionRate, amountDue) => {
  if (amountDue <= 0.01) {
    return {
      title: "All payments collected",
      subtitle: "No remaining balance",
      className: "text-green-600",
    };
  }

  if (collectionRate >= 80) {
    return {
      title: "Excellent collection rate",
      subtitle: `${formatMoney(amountDue)} still to collect`,
      className: "text-green-600",
    };
  }

  if (collectionRate >= 50) {
    return {
      title: "Good progress",
      subtitle: `${formatMoney(amountDue)} still to collect`,
      className: "text-yellow-600",
    };
  }

  return {
    title: "More payments needed",
    subtitle: `${formatMoney(amountDue)} still to collect`,
    className: "text-red-600",
  };
};

export default function FinancialOverview({ expenses = [], payments = [] }) {
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + getExpenseAmount(expense),
    0
  );

  const totalCollected = payments.reduce(
    (sum, payment) => sum + (Number(payment.amount) || 0),
    0
  );

  const balances = buildBalances(expenses, payments);
  const originalAmountDue = getOriginalAmountDue(expenses);
  const amountDue = roundMoney(getAmountDueFromBalances(balances));
  const amountCollected = Math.max(originalAmountDue - amountDue, 0);

  const collectionRate =
    originalAmountDue > 0
      ? Math.min((amountCollected / originalAmountDue) * 100, 100)
      : 100;

  const progressText = getProgressText(collectionRate, amountDue);

  const financialData = [
    {
      label: "Total Expenses",
      value: totalExpenses,
      format: "currency",
      trend: "neutral",
      icon: DollarSign,
      color: "blue",
    },
    {
      label: "Total Collected",
      value: totalCollected,
      format: "currency",
      trend: totalCollected > 0 ? "up" : "neutral",
      icon: CreditCard,
      color: "green",
    },
    {
      label: "Amount Due",
      value: amountDue,
      format: "currency",
      trend: amountDue > 0 ? "down" : "up",
      icon: Users,
      color: amountDue > 0 ? "red" : "green",
    },
    {
      label: "Collection Rate",
      value: collectionRate,
      format: "percentage",
      trend:
        collectionRate >= 80
          ? "up"
          : collectionRate >= 50
            ? "neutral"
            : "down",
      icon: Target,
      color:
        collectionRate >= 80 ? "green" : collectionRate >= 50 ? "yellow" : "red",
    },
  ];

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Percent className="h-4 w-4 text-gray-400" />;
    }
  };

  const getColorClasses = (color) => {
    const colorMap = {
      blue: "bg-blue-100 text-blue-600",
      green: "bg-green-100 text-green-600",
      red: "bg-red-100 text-red-600",
      yellow: "bg-yellow-100 text-yellow-600",
      gray: "bg-gray-100 text-gray-600",
    };

    return colorMap[color] || colorMap.gray;
  };

  const formatValue = (value, format) => {
    if (format === "currency") {
      return formatMoney(value);
    }

    if (format === "percentage") {
      return `${Number(value).toFixed(1)}%`;
    }

    return value;
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">
          Financial Overview
        </h3>

        <div className="flex items-center space-x-2">
          <DollarSign className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-500">Real-time</span>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {financialData.map((item) => {
          const IconComponent = item.icon;

          return (
            <div
              key={item.label}
              className="min-h-[84px] rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-4 transition-colors hover:border-gray-300"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg ${getColorClasses(
                      item.color
                    )}`}
                  >
                    <IconComponent className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-600">
                      {item.label}
                    </p>
                    <p className="truncate text-lg font-bold text-gray-900">
                      {formatValue(item.value, item.format)}
                    </p>
                  </div>
                </div>

                <div className="ml-2 flex-shrink-0">
                  {getTrendIcon(item.trend)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-purple-50 p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-semibold text-gray-700">
              Collection Progress
            </span>
          </div>

          <span className="text-lg font-bold text-gray-900">
            {collectionRate.toFixed(1)}%
          </span>
        </div>

        <div className="mb-2 h-3 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-3 rounded-full bg-green-500 transition-all duration-1000 ease-out"
            style={{ width: `${Math.min(collectionRate, 100)}%` }}
          />
        </div>

        <div className="mb-3 flex justify-between text-xs text-gray-600">
          <span>0%</span>
          <span className="font-medium">Target: 100%</span>
          <span>100%</span>
        </div>

        <div className="text-center">
          <p className={`text-sm font-medium ${progressText.className}`}>
            {progressText.title}
          </p>

          <p className="mt-1 text-xs text-gray-500">{progressText.subtitle}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-center">
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs text-gray-500">Expense Records</p>
          <p className="text-sm font-semibold text-gray-900">
            {expenses.length}
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs text-gray-500">Payment Records</p>
          <p className="text-sm font-semibold text-gray-900">
            {payments.length}
          </p>
        </div>
      </div>
    </div>
  );
}