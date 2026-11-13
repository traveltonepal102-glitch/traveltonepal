const NUMBER = new Intl.NumberFormat("en-US");

/** 5106 → "5,106 m" */
export const formatAltitude = (meters: number) => `${NUMBER.format(meters)} m`;

/** 1 → "1 day", 13 → "13 days" */
export const formatDays = (days: number) => `${days} ${days === 1 ? "day" : "days"}`;

/** 1280 → "$1,280" */
export const formatUsd = (amount: number) => `$${NUMBER.format(amount)}`;
