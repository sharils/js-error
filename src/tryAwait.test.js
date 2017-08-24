/**
 * No flow because I can't fix "identifier `describe`. Could not resolve name"
 */
import tryAwait from "./tryAwait";

describe("Feature: tryAwait", () => {
  describe("Scenario: Check spec", () => {
    test("should be a function", () => {
      const actual = tryAwait;

      expect(actual).toBeInstanceOf(Function);
    });

    test("arity should be 2", async () => {
      expect.assertions(1);

      try {
        await tryAwait();
      } catch (actual) {
        expect(actual).toBeInstanceOf(TypeError);
      }
    });

    test("errorClasses should not be empty", async () => {
      expect.assertions(1);

      try {
        await tryAwait([], Promise.resolve({}));
      } catch (actual) {
        expect(actual).toBeInstanceOf(TypeError);
      }
    });

    test("errorClasses should extend Errors", async () => {
      expect.assertions(1);

      try {
        await tryAwait([0], Promise.resolve({}));
      } catch (actual) {
        expect(actual).toBeInstanceOf(TypeError);
      }
    });

    test("errorClasses should allow Error", async () => {
      expect.assertions(0);

      try {
        await tryAwait([Error], Promise.resolve({}));
      } catch (actual) {
        expect(actual).toBeInstanceOf(TypeError);
      }
    });
  });

  describe("Scenario: Return", () => {
    const args = [[TypeError], Promise.resolve({})];

    test("should return result", async () => {
      const [, actual] = await tryAwait(...args);

      expect(actual).toBeDefined();
    });

    test("should not return error", async () => {
      const [actual] = await tryAwait(...args);

      expect(actual).toBeUndefined();
    });

    test("should be sparse result", async () => {
      const actual = await tryAwait(...args);

      expect(actual).not.toHaveProperty("0");
    });
  });

  describe("Scenario: Throw", () => {
    const args = [[Error, TypeError], Promise.reject(new TypeError())];

    test("should return undefined", async () => {
      const [, , actual] = await tryAwait(...args);

      expect(actual).toBeUndefined();
    });

    test("should return error at the same index as its class", async () => {
      const [, actual] = await tryAwait(...args);

      expect(actual).toBeInstanceOf(TypeError);
    });

    test("should be sparse result", async () => {
      const actual = await tryAwait(...args);

      expect(actual).not.toHaveProperty("0");
      expect(actual).not.toHaveProperty("2");
    });
  });

  describe("Scenario: Re-throw", () => {
    test("should re-throw in case of mismatch", async () => {
      expect.assertions(1);

      try {
        await tryAwait([Error], Promise.reject(new RangeError()));
      } catch (actual) {
        expect(actual).toBeInstanceOf(RangeError);
      }
    });
  });
});
