// @flow
export default (
  values: Array<typeof Error>,
  message: string = "values should be Error classes"
): Array<typeof Error> => {
  if (
    process.env.NODE_ENV === "production" ||
    values.every(value => value === Error || value.prototype instanceof Error)
  ) {
    return values;
  }
  throw new TypeError(message);
};
