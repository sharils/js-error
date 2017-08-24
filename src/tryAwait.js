// @flow
import assertLadenErrorClasses from "./assertLadenErrorClasses";
import assertLength from "./assertLength";
import { ng, ok } from "./option";

/**
 * return any because ./option returns any
 */
export default async (...args: any[]) => {
  assertLength(args, 2);

  const [errorClasses: Array<typeof Error>, value: any] = args;
  assertLadenErrorClasses(errorClasses);

  try {
    return ok(errorClasses, await value);
  } catch (e) {
    return ng(errorClasses, e);
  }
};
