import { LOCK_TIME_SECONDS, MAX_LOGIN_ATTEMPTS } from "../constants";

export type SignInError = { message: string; detail?: string };

const LOCK_MINUTES = LOCK_TIME_SECONDS / 60;
const minutes = (count: number) => `${count} ${count === 1 ? "minute" : "minutes"}`;

export const INVALID_INPUT: SignInError = { message: "Enter your email and password." };

export const UNAVAILABLE: SignInError = {
  message: "Sign-in isn't working right now.",
  detail: "Please try again in a moment.",
};

/**
 * A wrong email or password (also a correct password for someone who isn't an admin: the same message, so
 * nobody can find out which emails have accounts). Counts are per email, whether it exists or not.
 */
export const wrongCredentials = (failedAttempts: number): SignInError => {
  const triesLeft = Math.max(0, MAX_LOGIN_ATTEMPTS - failedAttempts);
  const tries = `${triesLeft} ${triesLeft === 1 ? "try" : "tries"} left.`;
  return {
    message: "Email or password is not right.",
    detail: `${tries} After ${MAX_LOGIN_ATTEMPTS} wrong tries, sign-in is locked for ${minutes(LOCK_MINUTES)}.`,
  };
};

/**
 * The email is locked until `lockedUntil`. Rounded up to whole minutes, but never more than the lock itself:
 * the database clock can run a little ahead of this server's.
 */
export const lockedOut = (lockedUntil: Date, now: Date): SignInError => {
  const minutesLeft = Math.min(LOCK_MINUTES, Math.max(1, Math.ceil((lockedUntil.getTime() - now.getTime()) / 60_000)));
  return {
    message: "Too many wrong tries.",
    detail: `Sign-in for this email is locked. Try again in ${minutes(minutesLeft)}.`,
  };
};
