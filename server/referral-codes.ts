import { randomInt } from "node:crypto";

export const REFERRAL_CODE_PATTERN = /^\d{2}[A-Z]{2}\d{2}$/;
const REFERRAL_LETTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ";

export function generateReferralCode(): string {
  const digit = () => randomInt(0, 10).toString();
  const letter = () => REFERRAL_LETTERS[randomInt(0, REFERRAL_LETTERS.length)];

  // Short, readable links with two uppercase letters in the middle
  // (for example: 58DR36).
  return `${digit()}${digit()}${letter()}${letter()}${digit()}${digit()}`;
}