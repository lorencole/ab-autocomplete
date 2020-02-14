const { sanitizeWord, search, getTopResults} = require('../index');

describe("sanitizeWord", () => {
  test("it should only return lowercase results", () => {
    const input = "BeTW";
    const output = "betw";
    expect(sanitizeWord(input)).toEqual(output);
  });
  test("it should strip out numbers and symbols", () => {
    const input = "$Be#tw$5";
    const output = "betw";
    expect(sanitizeWord(input)).toEqual(output);
  });
  test("it should handle undefined input", () => {
    const input = undefined;
    const output = "";
    expect(sanitizeWord(input)).toEqual(output);
  });
});

describe("search", () => {
  const library = "Some test file contents\nmore file Contents"
  test("it should return a hash of matches, 'contents' and 'Contents' should be counted in the same pile", () => {
    const searchTerm = "te";
    const output = { test: 1, contents: 2 };
    expect(search(searchTerm, library)).toEqual(output);
  });
  test("it should return no matches for an empty string", () => {
    const searchTerm = "";
    const output = {};
    expect(search(searchTerm, library)).toEqual(output);
  });
});

describe("getTopResults", () => {
  test("it should order results", () => {
    const results =  { f:6, a: 1, z: 26, b:2 };
    const output = [
      {"frequency": 26, "suggestion": "z"},
      {"frequency": 6, "suggestion": "f"},
      {"frequency": 2, "suggestion": "b"},
      {"frequency": 1, "suggestion": "a"}
    ];
    expect(getTopResults(results)).toEqual(output);
  });
  test("it should not return more than num results", () => {
    const results = { f:6, a: 1, z: 26, b:2 };
    const num = 2;
    const output = [
      {"frequency": 26, "suggestion": "z"},
      {"frequency": 6, "suggestion": "f"},
    ];
    expect(getTopResults(results, num)).toEqual(output);
  });
})
