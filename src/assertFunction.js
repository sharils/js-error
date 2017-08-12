// @flow
export default (
  value: Function,
  message: string = "value should be function"
): Function => {
  if (process.env.NODE_ENV === "production" || typeof value === "function") {
    return value;
  }
  throw new TypeError(message);
};
