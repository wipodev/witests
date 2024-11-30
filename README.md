# WiTests

**WiTests** is a lightweight, simple, and extensible testing library for Node.js projects. It allows you to define and run tests with a focus on clear organization and easy debugging.

## Features

- Group tests by files with automatic organization.
- Support for both single tests and test cases.
- Customizable color-coded output for better readability.
- Handles both success and error scenarios.
- Reports results per file and globally.

---

## Installation

Install `WiTests` as a dependency in your project:

```bash
npm install witests
```

## Usage

### 1. Writing Tests

Create test files (e.g., `example.test.js`) in your designated `tests` folder. Use the `define` and `defineTestCases` functions to register your tests:

```js
// example.test.js

define("Basic addition", () => 1 + 2, 3);

define(
  "Addition with nulls",
  () => {
    if (1 + null === null) throw new Error("Nulls cannot be summed");
  },
  { error: "Nulls cannot be summed" }
);

defineTestCases("Sum of numbers", (a, b) => a + b, {
  case1: { input: [1, 2], expected: 3 },
  case2: { input: [null, 2], expected: { error: "Nulls cannot be summed" } },
});
```

### 2. Running Tests

Run all tests in the specified folder (`tests` by default) or a single file using the CLI.

```bash
witests
```

Running a single test file

```bash
witests ./tests/example.test.js
```

### 3. Output Example

When you run the tests, `WiTests` will provide a detailed report:

```bath
Running WiTests...

Running tests from: example.test.js
Running test: Basic addition...
Test Basic addition passed! ✔️
Running test: Addition with nulls...
Test Addition with nulls passed! ✔️
Running test: Sum of numbers - case1...
Test Sum of numbers - case1 passed! ✔️
Running test: Sum of numbers - case2...
Test Sum of numbers - case2 passed! ✔️

All tests from example.test.js passed! 🎉
All tests passed globally! 🎉
```

## API Reference

### `define(name, testFn, expected)`

Define a single test.

- `name` (string): The name of the test.
- `testFn` (function): The test function to execute.
- `expected` (any): The expected result. Use `{ error: "Error message" }` for error tests.

### `defineTestCases(name, testFn, cases)`

Define multiple tests from a collection of cases.

- `name` (string): The base name for the tests.
- `testFn` (function): The test function to execute.
- `cases` (object): An object where keys are case names and values contain:
  - `input` (array): The input arguments for the test function.
  - `expected` (any): The expected result.

### `witestsRunner.run()`

Runs all registered tests, grouping results by file.

## Customization

### Colors

You can customize the output colors by passing an options object when creating the runner:

```js
const witestsRunner = new WitestsRunner({
  colors: {
    success: "\x1b[32m",
    failure: "\x1b[31m",
    title: "\x1b[35m",
    reset: "\x1b[0m",
  },
});
```

## License

MIT License. See [LICENSE](https://github.com/wipodev/witests/blob/main/LICENCE) for details.
