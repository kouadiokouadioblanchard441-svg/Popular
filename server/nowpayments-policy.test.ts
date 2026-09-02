import assert from "node:assert/strict";
import test from "node:test";
import {
  assessNowPaymentsDeposit,
  getNowPaymentsCallbackUrl,
  isNowPaymentsVerificationCode,
  NowPaymentsPayoutError,
  normalizeWithdrawalMode,
  nextWithdrawalStatusFromPayoutIpn,
  shouldReconcileNowPaymentsPayoutError,
} from "./nowpayments";

test("reads the public payment callback URL from APP_URL", () => {
  const previous = process.env.APP_URL;
  try {
    process.env.APP_URL = '"https://example.com"';
    assert.equal(
      getNowPaymentsCallbackUrl(),
      "https://example.com/api/nowpayments/ipn",
    );
  } finally {
    if (previous === undefined) delete process.env.APP_URL;
    else process.env.APP_URL = previous;
  }
});

test("credits only a finished NOWPayments deposit with the quoted asset and amount", () => {
  assert.equal(
    assessNowPaymentsDeposit({
      gatewayStatus: "finished",
      expectedAmount: "12.5",
      expectedCurrency: "usdtbsc",
      actuallyPaid: "12.5",
      payCurrency: "usdtbsc",
    }),
    "credit",
  );
});

test("keeps partial, underpaid, and wrong-asset deposits for review", () => {
  const base = {
    expectedAmount: "12.5",
    expectedCurrency: "usdtbsc",
    actuallyPaid: "12.4",
    payCurrency: "usdtbsc",
  };
  assert.equal(assessNowPaymentsDeposit({ ...base, gatewayStatus: "partially_paid" }), "review");
  assert.equal(assessNowPaymentsDeposit({ ...base, gatewayStatus: "finished" }), "review");
  assert.equal(
    assessNowPaymentsDeposit({ ...base, actuallyPaid: "12.5", payCurrency: "trx", gatewayStatus: "finished" }),
    "review",
  );
});

test("tracks non-final statuses without changing the balance", () => {
  assert.equal(
    assessNowPaymentsDeposit({
      gatewayStatus: "confirming",
      expectedAmount: "12.5",
      expectedCurrency: "usdtbsc",
      actuallyPaid: "12.5",
      payCurrency: "usdtbsc",
    }),
    "tracking",
  );
});

test("maps legacy auto settings to explicit semi-automatic mode", () => {
  assert.equal(normalizeWithdrawalMode("manual"), "manual");
  assert.equal(normalizeWithdrawalMode("auto"), "semi_auto");
  assert.equal(normalizeWithdrawalMode("semi_auto"), "semi_auto");
});

test("requires a six-digit 2FA code before a payout can be verified", () => {
  assert.equal(isNowPaymentsVerificationCode("123456"), true);
  assert.equal(isNowPaymentsVerificationCode("12345"), false);
  assert.equal(isNowPaymentsVerificationCode("12a456"), false);
});

test("does not let an out-of-order payout IPN bypass pending 2FA", () => {
  assert.equal(nextWithdrawalStatusFromPayoutIpn("pending_2fa", "waiting"), "pending_2fa");
  assert.equal(nextWithdrawalStatusFromPayoutIpn("pending_2fa", "processing"), "pending_2fa");
  assert.equal(nextWithdrawalStatusFromPayoutIpn("processing", "finished"), "approved");
  assert.equal(nextWithdrawalStatusFromPayoutIpn("processing", "failed"), "failed");
});

test("keeps terminal payout states absorbing when delayed IPNs arrive", () => {
  assert.equal(nextWithdrawalStatusFromPayoutIpn("approved", "waiting"), "approved");
  assert.equal(nextWithdrawalStatusFromPayoutIpn("approved", "failed"), "approved");
  assert.equal(nextWithdrawalStatusFromPayoutIpn("failed", "finished"), "failed");
});

test("moves ambiguous payout request failures to reconciliation instead of retrying", () => {
  assert.equal(
    shouldReconcileNowPaymentsPayoutError(
      new NowPaymentsPayoutError("timeout", true),
    ),
    true,
  );
  assert.equal(
    shouldReconcileNowPaymentsPayoutError(
      new NowPaymentsPayoutError("invalid verification code", false),
    ),
    false,
  );
});