export function normalizeString(str) {
  return str.toString().replace(/\s+/g, " ").trim();
}

export function diff(expected, received, { head = "Differences in the test", colors = {} } = {}) {
  const expectedStr = (expected || "").toString();
  const receivedStr = (received || "").toString();

  const expectedLines = expectedStr.split("\n");
  const receivedLines = receivedStr.split("\n");

  const {
    success = "\x1b[32m",
    failure = "\x1b[31m",
    diffMoved = "\x1b[33m",
    title = "\x1b[33m",
    subTitle = "\x1b[34m",
    reset = "\x1b[0m",
  } = colors;

  const mapExpected = new Map(expectedLines.map((line, index) => [line, index]));
  const mapReceived = new Map(receivedLines.map((line, index) => [line, index]));

  const diffReceived = [];
  const difference = [];
  let diffTitle = "Difference:";

  let i = 0;
  let j = 0;

  while (i < expectedLines.length || j < receivedLines.length) {
    if (expectedLines.length < 2 && receivedLines.length < 2) {
      diffReceived.push(`${failure}${received}${reset}`);
      diffTitle = "Details:";
      difference.push(`The result of the function did not match the expected value.
Please verify the implementation.`);
      break;
    }
    const expectedLine = expectedLines[i] || "";
    const receivedLine = receivedLines[j] || "";
    const pos1 = mapExpected.get(receivedLine);

    if (expectedLine === receivedLine && pos1 === j) {
      diffReceived.push(`  ${expectedLine}`);
      i++;
      j++;
    } else if (!mapExpected.has(receivedLine)) {
      if (receivedLine) {
        diffReceived.push(`${success}+ ${receivedLine}${reset}`);
        difference.push(`${subTitle}Added line: ${i + 1}${reset}`);
        difference.push(`${success}+ ${receivedLine}${reset}`);
      } else {
        diffReceived.push(receivedLine);
      }
      j++;
    } else if (!mapReceived.has(expectedLine)) {
      if (receivedLine) {
        diffReceived.push(`${failure}- ${expectedLine}${reset}`);
        difference.push(`${subTitle}Removed line: ${i + 1}${reset}`);
        difference.push(`${failure}- ${expectedLine}${reset}`);
      } else {
        diffReceived.push(receivedLine);
      }
      i++;
    } else {
      if (j < pos1) {
        if (receivedLine) {
          diffReceived.push(`${diffMoved}↑ ${receivedLine}${reset}`);
          difference.push(`${subTitle}Moved line: ${pos1 + 1} to ${j + 1}${reset}`);
          difference.push(`${diffMoved}↑ ${receivedLine}${reset}`);
        } else {
          diffReceived.push(receivedLine);
        }
        j++;
        if (expectedLine === receivedLine) i++;
      } else if (j > pos1) {
        if (receivedLine) {
          diffReceived.push(`${diffMoved}↓ ${receivedLine}${reset}`);
          difference.push(`${subTitle}Moved line: ${pos1 + 1} to ${j + 1}${reset}`);
          difference.push(`${diffMoved}↓ ${receivedLine}${reset}`);
        } else {
          diffReceived.push(receivedLine);
        }
        j++;
        if (expectedLine === receivedLine) i++;
      } else {
        i++;
      }
    }
  }

  const output = `${failure}${head}${reset}

${title}Expected:${reset}
${subTitle}${expected}${reset}

${title}Received:${reset}
${diffReceived.join("\n")}

${title}${diffTitle}${reset}
${difference.join("\n")}
`;

  return output;
}
