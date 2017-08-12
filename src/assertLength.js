// @flow

/**
 * Use any because Arguments doesn't work
 */
export default (
  value: any[],
  expected: number,
  message: string = `value length should be ${expected}`
): any[] => {
  if (process.env.NODE_ENV === "production" || value.length === expected) {
    return value;
  }
  throw new TypeError(message);
};
