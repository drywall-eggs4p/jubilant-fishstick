const display = document.querySelector("#display");
const keys = document.querySelector(".keys");

let currentValue = "0";
let storedValue = null;
let operator = null;
let waitingForOperand = false;

function render() {
  display.textContent = currentValue;
}

function enterDigit(digit) {
  if (waitingForOperand) {
    currentValue = digit;
    waitingForOperand = false;
  } else if (currentValue === "0") {
    currentValue = digit;
  } else if (currentValue.length < 14) {
    currentValue += digit;
  }
  render();
}

function enterDecimal() {
  if (waitingForOperand) {
    currentValue = "0.";
    waitingForOperand = false;
  } else if (!currentValue.includes(".")) {
    currentValue += ".";
  }
  render();
}

function calculate(left, right, operation) {
  switch (operation) {
    case "+": return left + right;
    case "-": return left - right;
    case "*": return left * right;
    case "/": return right === 0 ? null : left / right;
    default: return right;
  }
}

function formatResult(value) {
  if (!Number.isFinite(value)) return "Error";
  return String(Number(value.toPrecision(10)));
}

function chooseOperator(nextOperator) {
  const inputValue = Number(currentValue);

  if (operator && !waitingForOperand) {
    const result = calculate(storedValue, inputValue, operator);
    if (result === null) {
      showError();
      return;
    }
    currentValue = formatResult(result);
    storedValue = Number(currentValue);
    render();
  } else {
    storedValue = inputValue;
  }

  operator = nextOperator;
  waitingForOperand = true;
}

function equals() {
  if (!operator || waitingForOperand) return;

  const result = calculate(storedValue, Number(currentValue), operator);
  if (result === null) {
    showError();
    return;
  }

  currentValue = formatResult(result);
  storedValue = null;
  operator = null;
  waitingForOperand = true;
  render();
}

function showError() {
  currentValue = "Error";
  storedValue = null;
  operator = null;
  waitingForOperand = true;
  render();
}

function clear() {
  currentValue = "0";
  storedValue = null;
  operator = null;
  waitingForOperand = false;
  render();
}

function deleteLast() {
  if (waitingForOperand || currentValue === "Error") return clear();
  currentValue = currentValue.length > 1 ? currentValue.slice(0, -1) : "0";
  if (currentValue === "-" || currentValue === "") currentValue = "0";
  render();
}

function handleAction(action) {
  switch (action) {
    case "clear": clear(); break;
    case "delete": deleteLast(); break;
    case "decimal": enterDecimal(); break;
    case "equals": equals(); break;
  }
}

keys.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.digit !== undefined) enterDigit(button.dataset.digit);
  else if (button.dataset.operator) chooseOperator(button.dataset.operator);
  else if (button.dataset.action) handleAction(button.dataset.action);
});

document.addEventListener("keydown", (event) => {
  if (/^[0-9]$/.test(event.key)) enterDigit(event.key);
  else if (event.key === ".") enterDecimal();
  else if (["+", "-", "*", "/"].includes(event.key)) chooseOperator(event.key);
  else if (event.key === "Enter" || event.key === "=") {
    event.preventDefault();
    equals();
  } else if (event.key === "Backspace") deleteLast();
  else if (event.key === "Escape") clear();
});

render();
