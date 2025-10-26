import { BN } from "@coral-xyz/anchor";

/**
 * Converts a decimal string amount into a raw integer amount respecting the token decimals.
 */
export function amountToRawAmount(value: string, decimals: number): BN {
  const trimmed = value.trim();

  if (!trimmed) {
    throw new Error("Enter an amount to deposit.");
  }

  if (!/^\d+(\.\d+)?$/.test(trimmed)) {
    throw new Error("Amount must be a numeric value.");
  }

  const [wholePart, fractionalPart = ""] = trimmed.split(".");

  if (fractionalPart.length > decimals) {
    throw new Error(`Amount supports up to ${decimals} decimal places.`);
  }

  const base = new BN(10).pow(new BN(decimals));
  const whole = new BN(wholePart || "0").mul(base);
  const fraction = new BN(
    (fractionalPart.padEnd(decimals, "0") || "0").slice(0, decimals) || "0",
    10,
  );
  const total = whole.add(fraction);

  if (total.isZero()) {
    throw new Error("Amount must be greater than zero.");
  }

  return total;
}

/**
 * Shortens a transaction signature for display, preserving the start and end.
 */
export function shortenSignature(signature: string) {
  if (signature.length <= 12) {
    return signature;
  }

  return `${signature.slice(0, 6)}...${signature.slice(-6)}`;
}
