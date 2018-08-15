const DAY_IN_MSEC: number = 1000 * 60 * 60 * 24;

// Returns the date in @n  from now.
function dateInNDays(n: number): Date {
  return new Date(Date.now() + DAY_IN_MSEC * n);
}

export { dateInNDays };
