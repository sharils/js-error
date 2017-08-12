// @flow
export default <T>(
  values: T[],
  message: string = "values should be laden array"
): T[] => {
  if (process.env.NODE_ENV === "production" || values.length > 0) {
    return values;
  }
  throw new TypeError(message);
};
