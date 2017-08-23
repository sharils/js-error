// @flow

// https://github.com/sharils/js-try/issues/2
import "babel-polyfill";

import assertLadenErrorClasses from "./assertLadenErrorClasses";
import assertLength from "./assertLength";
import { ng, ok } from "./option";

/**
 * return any because ./option returns any
 */
export default function*(...args: any[]): any {
  assertLength(args, 2);

  const [errorClasses: Array<typeof Error>, value: any] = args;
  assertLadenErrorClasses(errorClasses);

  try {
    return ok(errorClasses, yield value);
  } catch (e) {
    return ng(errorClasses, e);
  }
}
