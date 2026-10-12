let leftOperand = '';
let rightOperand = '';
let operator = '';
let result = '0';

// Lower part of the display, showing the current input or the result
const currentDisplay = document.querySelector('.display .current');
// Higher part of the display, showing the operation
const operationDisplay = document.querySelector('.display .operation');

const numPad = document.querySelector('.buttons-container');

numPad.addEventListener('click', (e) => {
  // Prevent a button to being focused and then triggering unexpected behaviours when using keyboard
  e.target.blur();
  
  // Avoid to get the whole numPad as an input if clicking between the buttons
  if (e.target.className === 'buttons-container') return; 

  const input = e.target.innerText;
  if (!isValidInput(input)) return;

  main(input);
});

document.addEventListener('keydown', (e) => {
  const input = mapKey(e.key);

  main(input);
});


// Main function with the calculation logic
function main(input) {

  if (input === 'C') clear();
  else if (input === 'CE') clearEntry();
  else if (input === 'Backspace') backspace();
  else if (input === '+/-') negate();
  else if (input === '=') {
    // Use what is already on the display in case of no new input
      rightOperand = rightOperand || currentDisplay.innerText; 

      result = operate(operator, leftOperand, rightOperand);
      operationDisplay.innerText = operator ? `${leftOperand} ${operator} ${rightOperand} =` : `${rightOperand} =`
      leftOperand = result;

      currentDisplay.innerText = result;

  } else if (isOperator(input)) {
    // In case last operation was made with the '=' sign
    // Simulate the same situation of only one number being in the rightOperand variable
    // In this case we assign the result of the previous operation (made with the = operator) to rightOperator
    if (operationDisplay.innerText.slice(-1) === '=') {
      operator = '';
      rightOperand = result;
      leftOperand = '';
      
    }
    result = operate(operator, leftOperand, rightOperand);
    operator = input;
    rightOperand = '';
    leftOperand = result;
    operationDisplay.innerText = `${leftOperand} ${operator}`;

    currentDisplay.innerText = result;

    // Mostly check for keyboard input
  } else if (isAppendableInput(input, rightOperand) && currentDisplay.innerText.length < 14) {
    // Start a new operation giving input without operator
    if (operationDisplay.innerText.slice(-1) === '=') {
      clear();
      rightOperand = input;
    } else {
      rightOperand += input;
    }
    currentDisplay.innerText = rightOperand;
  }

  currentDisplay.innerText = currentDisplay.innerText.slice(0, 14);
  if (currentDisplay.innerText === 'Infinity') {
    disableButtons();
    currentDisplay.style.fontSize = '1.5em';
    currentDisplay.innerText = "Cannot divide by 0";
  }
}

function add(a, b) {
  return (+a + +b).toString();
}


function backspace() {
  rightOperand = rightOperand.slice(0, -1);
  currentDisplay.innerText = rightOperand ? rightOperand : '0';
}


// Reset the calculator to initial state
function clear() {
  leftOperand = '';
  rightOperand = '';
  operator = '';
  result = '0';
  operationDisplay.innerText = '';
  currentDisplay.innerText = '0';
  currentDisplay.style.fontSize = '2em';
  enableButtons();
  
}


function clearEntry() {
  rightOperand = '';
  currentDisplay.innerText = '0';
  if (operationDisplay.innerText.slice(-1) === '=') {
    operationDisplay.innerText = '';
    operator = '';
    leftOperand = '';
  }
}


// Disable all the buttons but the 'C' button
function disableButtons() {
  const buttons = document.querySelectorAll('button');
  // Take out the 'C' button
  const filtButtons = Array.from(buttons).filter(item => item.innerText !== 'C');
  filtButtons.forEach((button) => button.disabled = true);
}


/* How to handle division by 0?
   * Leave the Infinity return, or return a string 'Cannot divide by 0'?
   */
function divide(a, b) {
  if (b === '') return a;
  return (+a / +b).toString();
}


// Enable all the buttons
function enableButtons() {
  const buttons = document.querySelectorAll('button');
  buttons.forEach((button) => button.disabled = false);
}


// Returns true if the input can be appended to the prefix: if it is a number, 
// or a point, only in case that there is not another point already 
function isAppendableInput(input, prefix) {
  if ((input === '.' && !prefix.includes('.'))
    || (+input >= 0 && +input <= 9)
  ) return true;

  return false;
}


// Returns true if the input is valid
function isValidInput(input) {
  const validSigns = ['CE', 'C', 'backspace', '/', 'x', '-', '+', '=', '.', '+/-'];
  return validSigns.includes(input) || (+input >= 0 && +input <= 9) ? true : false;
}


// Returns true if the input is one of the 4 operators available or equal
function isOperator(input) {
  return (['/', 'x', '-', '+'].includes(input)) ? true : false
}

// Map keys as received from the event 'keydown' to the same values that buttons have
function mapKey(key) {
  return (key === 'Delete') ? 'CE' :
    (key === 'Escape') ? 'C' :
    (key === 'Enter') ? '=' :
    (key === '*') ? 'x' :
    key;
}


function multiply(a, b) {
  if (b === '') return a;
  return (+a * +b).toString();
}


function negate() {
  if (operationDisplay.innerText.slice(-1) === '=' || rightOperand === '') {
    leftOperand = (+leftOperand * -1).toString();
    currentDisplay.innerText = leftOperand;
    if (rightOperand === '') operationDisplay.innerText = `${leftOperand} ${operator}`;
  } else {
    rightOperand = (+rightOperand * -1).toString();
    currentDisplay.innerText = rightOperand;
  }
}


// a and b are received as strings, and returned as strings
// conversion from string to number is handled inside the single functions
// This allow to handle the cases where b is an empty string, meaning that rightOperand is empty
function operate(operator, a, b) {
  switch (operator) {
    case '+':
      return add(a, b);
    case '-':
      return subtract(a, b);
    case 'x':
      return multiply(a, b);
    case '/':
      return divide(a, b);
    default: // In case there is not operator, like 5 =, the result is simply 5
      return +b.toString(); 
  }
}


function subtract(a, b) {
  return (+a - +b).toString();
}