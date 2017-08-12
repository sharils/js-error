// @flow
import assertFunction from "./assertFunction";
import assertLadenErrorClasses from "./assertLadenErrorClasses";
import { ng, ok } from "./option";

/**
 * return any because ./option returns any
 */
export default (
  errorClasses: Array<typeof Error>,
  fn: () => any,
  ...args: any[]
): any => {
  assertLadenErrorClasses(errorClasses);
  assertFunction(fn);

  try {
    return ok(errorClasses, fn(...args));
  } catch (e) {
    return ng(errorClasses, e);
  }
};
