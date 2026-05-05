const roundMoney = (value) => Math.round((Number(value) || 0) * 100) / 100;

export const formatMoney = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(amount) || 0);

export function getPartialPaidAmount(member) {
  return roundMoney(
    (member.partialPayments || []).reduce(
      (sum, payment) => sum + (Number(payment.amount) || 0),
      0
    )
  );
}

export function getPaidForExpenses(member) {
  return roundMoney(member.paid);
}

export function getManualPaidAmount(member) {
  const paidForExpenses = getPaidForExpenses(member);
  const fairShare = roundMoney(member.share);
  const paymentHistoryAmount = getPartialPaidAmount(member);

  // Best source of truth: real payment history records.
  if ((member.partialPayments || []).length > 0) {
    return paymentHistoryAmount;
  }

  // If this person already paid group expenses enough to cover their share,
  // do not count old paidAmount again. That causes double-counting.
  if (paidForExpenses >= fairShare) {
    return 0;
  }

  return roundMoney(member.paidAmount);
}

export function getMemberPaymentSummary(member) {
  const fairShare = roundMoney(member.share);
  const paidForExpenses = getPaidForExpenses(member);
  const manualPaidAmount = getManualPaidAmount(member);

  const totalContributed = roundMoney(paidForExpenses + manualPaidAmount);

  const paidTowardShare = roundMoney(Math.min(totalContributed, fairShare));
  const stillOwes = roundMoney(Math.max(fairShare - totalContributed, 0));
  const getsBack = roundMoney(Math.max(totalContributed - fairShare, 0));

  return {
    fairShare,
    paidForExpenses,
    manualPaidAmount,
    totalContributed,
    paidTowardShare,
    stillOwes,
    getsBack,
    overpaidAmount: getsBack,
    isPaid: stillOwes === 0 && fairShare > 0,
    isPartial: paidTowardShare > 0 && stillOwes > 0,
    isOverpaid: getsBack > 0,
  };
}

export function getPaidTowardShare(member) {
  return getMemberPaymentSummary(member).paidTowardShare;
}

export function getStillOwes(member) {
  return getMemberPaymentSummary(member).stillOwes;
}

export function getOverpaidAmount(member) {
  return getMemberPaymentSummary(member).getsBack;
}

export function getRemainingPaymentCapacity(member) {
  return getStillOwes(member);
}

export function getPaymentStatusFromAmount(member, newManualPaidAmount) {
  const fairShare = roundMoney(member.share);
  const paidForExpenses = getPaidForExpenses(member);
  const totalContributed = roundMoney(
    paidForExpenses + (Number(newManualPaidAmount) || 0)
  );

  if (totalContributed <= 0) {
    return "unpaid";
  }

  if (totalContributed >= fairShare) {
    return "paid";
  }

  return "partial";
}