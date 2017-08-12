// @flow

const option = (idx, value) => {
  const errors = [];
  errors[idx] = value;
  return errors;
};

/**
 * Return any because:
 *
 * 1. Returning union of various length of tuple doesn't work
 * 2. Defining sparse tuple doesn't work
 */
export const ng = (errorClasses: Array<typeof Error>, e: Error): any => {
  const idx = errorClasses.indexOf(e.constructor);
  if (idx === -1) {
    throw e;
  }
  return option(idx, e);
};

/**
 * Return any for the same reason as `` ng ``
 */
export const ok = <T>(errorClasses: Array<typeof Error>, result: T): any =>
  option(errorClasses.length, result);
