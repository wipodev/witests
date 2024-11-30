import { diff, normalizeString } from "./utils.js";

export default class WitestsRunner {
  constructor(options = {}) {
    const defaultColors = {
      success: "\x1b[32m",
      failure: "\x1b[31m",
      diffMoved: "\x1b[33m",
      title: "\x1b[33m",
      subTitle: "\x1b[34m",
    };
    this.colors = { ...defaultColors, ...options.colors };
    this.reset = "\x1b[0m";
    this.tests = {};
  }

  defineTest(name, func, expected, fileName) {
    if (!this.tests[fileName]) this.tests[fileName] = [];
    const isErrorTest = expected && expected.error !== undefined;
    this.tests[fileName].push({ name, func, expected, isErrorTest });
  }

  defineTestCases(name, testFn, cases, fileName) {
    for (const [caseName, { input, expected }] of Object.entries(cases)) {
      this.defineTest(`${name} - ${caseName}`, () => testFn(...input), expected, fileName);
    }
  }

  async run() {
    let allPassed = 0;
    let allFailed = 0;

    console.info(`\n${this.colors.subTitle}Running Witests...${this.reset}`);

    for (const [fileName, tests] of Object.entries(this.tests)) {
      console.info(`\n${this.colors.subTitle}Running tests from: ${fileName}${this.reset}`);

      let passed = 0;
      let failed = 0;

      for (const { name, func, expected, isErrorTest } of tests) {
        console.info(`${this.colors.title}Running test: ${name}...${this.reset}`);

        try {
          const result = await func();

          if (isErrorTest) {
            console.info(
              `${this.colors.failure}❌ Test failed: ${name} (se esperaba un error, pero no se lanzó)${this.reset}`
            );
            failed++;
          } else {
            if (normalizeString(result) === normalizeString(expected)) {
              console.info(`${this.colors.success}Test ${name} passed! ✔️${this.reset}`);
              passed++;
            } else {
              console.log(diff(expected, result, { head: `Test ${name} failed!` }));
              failed++;
            }
          }
        } catch (error) {
          if (isErrorTest && error.message === expected.error) {
            console.info(`${this.colors.success}Test ${name} passed! ✔️${this.reset}`);
            passed++;
          } else {
            console.error(`❌ Test failed: ${name} (error inesperado: ${error.message})`);
            failed++;
          }
        }
      }

      allPassed += passed;
      allFailed += failed;

      console.info(
        failed === 0
          ? `\n${this.colors.success}All tests from ${fileName} passed! 🎉${this.reset}`
          : `\n${this.colors.failure}Some tests from ${fileName} failed.${this.reset}`
      );

      if (failed > 0) {
        console.info(`${this.colors.subTitle}${passed + failed} tests from ${fileName}${this.reset}`);
        console.info(`${this.colors.success}${passed} test passed.${this.reset}`);
        console.info(`${this.colors.failure}${failed} failed tests${this.reset}`);
      }
    }

    console.info(
      allFailed === 0
        ? `\n${this.colors.success}All tests passed globally! 🎉${this.reset}\n`
        : `\n${this.colors.failure}Some tests failed globally. See above for details.${this.reset}`
    );

    if (allFailed > 0) {
      console.info(`${this.colors.subTitle}${allPassed + allFailed} tests globally${this.reset}`);
      console.info(`${this.colors.success}${allPassed} test passed.${this.reset}`);
      console.info(`${this.colors.failure}${allFailed} failed tests${this.reset}\n`);
    }
  }
}

export const witestsRunner = new WitestsRunner();

globalThis.define = (name, testFn, expected) => {
  witestsRunner.defineTest(name, testFn, expected, globalThis.currentTestFile || "unknown file");
};

globalThis.defineTestCases = (name, testFn, cases) => {
  witestsRunner.defineTestCases(name, testFn, cases, globalThis.currentTestFile || "unknown file");
};
