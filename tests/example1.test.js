// Simple definitions for creating unit tests
define("Suma básica", () => 1 + 2, 4);
define("Suma con texto", () => 1 + 2, "3");
define("Resta básica", () => 5 - 3, 2);

function suma(a, b) {
  if (a === null || b === null) {
    throw new Error("No se pueden sumar valores nulos");
  }
  return a + b;
}

define("Suma de números nulos", () => suma(null, 2), { error: "No se pueden sumar valores nulos" });

// Multiple case definitions can be for multiple tests or for applying multiple cases to the same test
const cases = {
  case1: { input: [1, 2], expected: 3 },
  case2: { input: [1, null], expected: { error: "No se pueden sumar valores nulos" } },
  case3: { input: [null, 2], expected: { error: "No se pueden sumar valores nulos" } },
  case4: { input: [null, null], expected: { error: "No se pueden sumar valores nulos" } },
  case5: { input: [1, 2], expected: 3 },
};

defineTestCases("Suma de números", suma, cases);
