#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { witestsRunner } from "../lib/witests.js";

const testPath = process.argv[2] || "./tests";

async function runTests(filePath, fileName) {
  globalThis.currentTestFile = fileName;
  await import(filePath.href);
}

if (fs.statSync(testPath).isDirectory()) {
  const testFiles = fs.readdirSync(testPath).filter((file) => file.endsWith(".test.js"));

  for (const file of testFiles) {
    await runTests(pathToFileURL(path.join(testPath, file)), file);
  }
} else {
  await runTests(testPath, path.basename(testPath));
}
await witestsRunner.run();
