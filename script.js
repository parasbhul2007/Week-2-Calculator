const display = document.getElementById("display");
const previous = document.getElementById("previous");
const keys = document.querySelector(".keys");

let current = "0";
let stored = null;
let operator = null;
let shouldStartNew = false;

function updateScreen() {
  display.textContent = current;
  previous.textContent =
    stored !== null && operator ? stored + " " + operator : "";
}

function addNumber(number) {
  if (shouldStartNew || current === "Error") {
    current = number;
    shouldStartNew = false;
  } else if (current === "0") {
    current = number;
  } else if (current.length < 14) {
    current += number;
  }
  updateScreen();
}

function addDecimal() {
  if (shouldStartNew || current === "Error") {
    current = "0.";
    shouldStartNew = false;
  } else if (!current.includes(".")) {
    current += ".";
  }
  updateScreen();
}

function calculate() {
  if (stored === null || operator === null) return;
  const first = Number(stored);
  const second = Number(current);
  let answer;

  if (operator === "+") answer = first + second;
  if (operator === "-") answer = first - second;
  if (operator === "*") answer = first * second;
  if (operator === "/") answer = second === 0 ? NaN : first / second;

  if (!Number.isFinite(answer)) {
    current = "Error";
  } else {
    current = String(Number(answer.toPrecision(10)));
  }
  stored = null;
  operator = null;
  shouldStartNew = true;
  updateScreen();
}

function chooseOperator(nextOperator) {
  if (current === "Error") return;
  if (stored !== null && operator && !shouldStartNew) calculate();
  stored = current;
  operator = nextOperator;
  shouldStartNew = true;
  updateScreen();
}

keys.addEventListener("click", function (event) {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.number !== undefined) addNumber(button.dataset.number);
  if (button.dataset.operator) chooseOperator(button.dataset.operator);
  if (button.dataset.action === "decimal") addDecimal();
  if (button.dataset.action === "equals") calculate();
  if (button.dataset.action === "clear") {
    current = "0";
    stored = null;
    operator = null;
    shouldStartNew = false;
    updateScreen();
  }
  if (button.dataset.action === "delete" && current !== "Error") {
    current = current.length > 1 ? current.slice(0, -1) : "0";
    updateScreen();
  }
});

document.addEventListener("keydown", function (event) {
  if (/^[0-9]$/.test(event.key)) addNumber(event.key);
  else if (event.key === ".") addDecimal();
  else if (["+", "-", "*", "/"].includes(event.key)) chooseOperator(event.key);
  else if (event.key === "Enter" || event.key === "=") {
    event.preventDefault();
    calculate();
  } else if (event.key === "Backspace") {
    current = current.length > 1 ? current.slice(0, -1) : "0";
    updateScreen();
  } else if (event.key === "Escape") {
    current = "0";
    stored = null;
    operator = null;
    shouldStartNew = false;
    updateScreen();
  }
});
