/**
 * No flow because I can't fix "identifier `describe`. Could not resolve name"
 */
import tryYield from "./tryYield";

describe("Feature: tryYield", () => {
  describe("Scenario: Check spec", () => {
    test("should be a function", () => {
      const actual = tryYield;

      expect(actual).toBeInstanceOf(Function);
    });

    test("arity should be 2", () => {
      const actual = () => tryYield().next();

      expect(actual).toThrow(TypeError);
    });

    test("errorClasses should not be empty", () => {
      const actual = () => tryYield([], {}).next();

      expect(actual).toThrow(TypeError);
    });

    test("errorClasses should extend Errors", () => {
      const actual = () => tryYield([0], {}).next();

      expect(actual).toThrow(TypeError);
    });

    test("errorClasses should allow Error", () => {
      const actual = () => tryYield([Error], {}).next();

      expect(actual).not.toThrow();
    });
  });

  describe("Scenario: Return", () => {
    const args = [[TypeError], {}];

    test("should return result", () => {
      const g = tryYield(...args);
      g.next();
      const { value: [, actual] } = g.next({});

      expect(actual).toBeDefined();
    });

    test("should be done", () => {
      const g = tryYield(...args);
      g.next();
      const { done: actual } = g.next();

      expect(actual).toBe(true);
    });

    test("should not return error", () => {
      const g = tryYield(...args);
      g.next();
      const { value: [actual] } = g.next({});

      expect(actual).toBeUndefined();
    });

    test("should be sparse result", () => {
      const g = tryYield(...args);
      g.next();
      const { value: actual } = g.next({});

      expect(actual).not.toHaveProperty("0");
    });
  });

  describe("Scenario: Throw", () => {
    const args = [[Error, TypeError], {}];

    test("should return undefined", () => {
      const g = tryYield(...args);
      g.next();
      const { value: [, , actual] } = g.throw(new TypeError());

      expect(actual).toBeUndefined();
    });

    test("should be done", () => {
      const g = tryYield(...args);
      g.next();
      const { done: actual } = g.throw(new TypeError());

      expect(actual).toBe(true);
    });

    test("should return error at the same index as its class", () => {
      const g = tryYield(...args);
      g.next();
      const { value: [, actual] } = g.throw(new TypeError());

      expect(actual).toBeInstanceOf(TypeError);
    });

    test("should be sparse result", () => {
      const g = tryYield(...args);
      g.next();
      const { value: actual } = g.throw(new TypeError());

      expect(actual).not.toHaveProperty("0");
      expect(actual).not.toHaveProperty("2");
    });
  });

  describe("Scenario: Re-throw", () => {
    test("should re-throw in case of mismatch", () => {
      const g = tryYield([Error], {});
      g.next();
      const actual = () => {
        g.throw(new RangeError());
      };
      expect(actual).toThrow(RangeError);
    });
  });

  describe("Scenario: Delegate", () => {
    function* main() {
      return yield* tryYield([TypeError], yield);
    }

    test("should get option from yield*", () => {
      const expected = {};

      const g = main();
      g.next();
      g.next();
      const { value: [, actual] } = g.next(expected);

      expect(actual).toBe(expected);
    });

    test("should be done", () => {
      const expected = {};

      const g = main();
      g.next();
      g.next();
      const { done } = g.next(expected);

      expect(done).toBe(true);
    });
  });
});
