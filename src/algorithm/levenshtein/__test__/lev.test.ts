import { levWrapper } from "../lev";

describe("Levenstein", () => {
  test("'abc' and 'abc'", () => {
    expect(levWrapper("abc", "abc")).toEqual(0);
  });
  test("'abc' and 'abd'", () => {
    expect(levWrapper("abc", "abd")).toEqual(1);
  });
  test("'abc' and 'abcd'", () => {
    expect(levWrapper("abc", "abcd")).toEqual(1);
  });
  test("'abc' and 'ab'", () => {
    expect(levWrapper("abc", "ab")).toEqual(1);
  });
  test("'abc' and 'abcde'", () => {
    expect(levWrapper("abc", "abcde")).toEqual(2);
  });
});
