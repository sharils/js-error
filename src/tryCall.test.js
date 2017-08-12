/**
 * No flow because I can't fix "identifier `describe`. Could not resolve name"
 */
import tryCall from "./tryCall";

describe("Feature: tryCall", () => {
  describe("Scenario: Check spec", () => {
    test("should be a function", () => {
      const actual = tryCall;

      expect(actual).toBeInstanceOf(Function);
    });

    test("fn should be function", () => {
      const actual = () => tryCall([Error], {});

      expect(actual).toThrow(TypeError);
    });

    test("errorClasses should not be empty", () => {
      const actual = () => tryCall([], () => {});

      expect(actual).toThrow(TypeError);
    });

    test("errorClasses should extend Errors", () => {
      const actual = () => tryCall([0], () => {});

      expect(actual).toThrow(TypeError);
    });

    test("errorClasses should allow Error", () => {
      const actual = () => tryCall([Error], () => {});

      expect(actual).not.toThrow();
    });

    test("fn should get args", () => {
      const args = [jest.fn(), {}];
      tryCall([TypeError], ...args);
      const [{ mock: { calls: [[actual]] } }, object] = args;

      expect(actual).toBe(object);
    });

    test("fn should be called once", () => {
      const fn = jest.fn();
      tryCall([TypeError], fn);
      const { mock: { calls: { length: actual } } } = fn;

      expect(actual).toBe(1);
    });
  });

  describe("Scenario: Return", () => {
    const args = [[TypeError], jest.fn(() => ({}))];

    test("should return result", () => {
      const [, actual] = tryCall(...args);

      expect(actual).toBeDefined();
    });

    test("should not return error", () => {
      const [actual] = tryCall(...args);

      expect(actual).not.toBeInstanceOf(TypeError);
    });

    test("should be sparse result", () => {
      const actual = tryCall(...args);

      expect(actual).not.toHaveProperty("0");
    });
  });

  describe("Scenario: Throw", () => {
    const args = [
      [Error, TypeError],
      jest.fn(() => {
        throw new TypeError();
      })
    ];

    test("should return undefined", () => {
      const [, , actual] = tryCall(...args);

      expect(actual).toBeUndefined();
    });

    test("should return error at the same index as its class", () => {
      const [, actual] = tryCall(...args);

      expect(actual).toBeInstanceOf(TypeError);
    });

    test("should be sparse result", () => {
      const actual = tryCall(...args);

      expect(actual).not.toHaveProperty("0");
      expect(actual).not.toHaveProperty("2");
    });
  });

  describe("Scenario: Re-throw", () => {
    test("should re-throw in case of mismatch", () => {
      const actual = () => {
        tryCall(
          [Error],
          jest.fn(() => {
            throw new RangeError();
          })
        );
      };
      expect(actual).toThrow(RangeError);
    });
  });
});
