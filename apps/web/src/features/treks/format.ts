const NUMBER = new Intl.NumberFormat("en-US");

/** 5545 → "5,545 m" */
export const formatAltitude = (meters: number) => `${NUMBER.format(meters)} m`;

/** 1000 → "$1,000" */
export const formatUsd = (amount: number) => `$${NUMBER.format(amount)}`;
