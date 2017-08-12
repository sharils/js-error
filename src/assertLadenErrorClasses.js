// @flow
import assertErrorClasses from "./assertErrorClasses";
import assertLaden from "./assertLaden";

export default (
  values: Array<typeof Error>,
  message: string = "values should be laden Error classes"
): Array<typeof Error> => {
  if (process.env.NODE_ENV === "production") {
    return values;
  }
  return assertErrorClasses(assertLaden(values, message), message);
};
