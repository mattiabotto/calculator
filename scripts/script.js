let leftOperand = '';
let rightOperand = '';
let operator = '';

// Lower part of the display, showing the current input or the result
const currentDisplay = document.querySelector('.display .current');
// Higher part of the display, showing the operation
const operationDisplay = document.querySelector('.display .operation');

const numPad = document.querySelector('.buttons-container');
numPad.addEventListener('click', main);


// Main function with the calculation logic
function main(e) {

  // Avoid to get the whole numPad as an input if clicking between the buttons
  if (e.target.className === 'buttons-container') return; 
  
  const input = e.target.innerText;
  if (!isValidInput(input)) return;

  if (input === '=' && rightOperand && leftOperand) {
    // Show the operation before updating variables
    operationDisplay.innerText = `${leftOperand} ${operator} ${rightOperand} =`;
    
    rightOperand = operate(operator, +leftOperand, +rightOperand).toString();
    
    // Show result into the current screen
    currentDisplay.innerText = rightOperand;
    leftOperand = rightOperand;
  }

  if (isOperator(input)) {
    operator = input;

    if (leftOperand && rightOperand) {
      rightOperand = operate(operator, +leftOperand, +rightOperand).toString();
      // Show result into the current screen
      currentDisplay.innerText = rightOperand;
    }

    leftOperand = rightOperand;
    operationDisplay.innerText = `${leftOperand} ${operator}`;

    // TODO: check what happens in case of first time input!
    rightOperand = '';
    return;
  } 

  if (isAppendableInput(input, rightOperand)) {
    rightOperand += input;
    currentDisplay.innerText = rightOperand;
  }

  console.log(`leftOperand: ${leftOperand} \n rightOperand: ${rightOperand}`);

}

/*
Input

- Different buttons trigger different actions:
  - Numbers and the point change the content of rightOperand, and current display is updated with righOperand
  - +/- operator invert the sign of userInput
  - operators (+, -, x, /):
    - Move userInput into leftOperand
    - Display leftOperand and the operator into the operation display
    - leftOperand (or the old userInput), should stay on the current display, and used in case no further userInput
      is provided, but instead an equal rightaway is provided (ex. the input: 8, +, = should evaluate as 8 + 8 = 16
      and every pression of the = sign should continue with the same operation and the same rightOperand, updating the
      left operand with the new result, like 8 + 8 = 16 -> 16 + 8 = 24 -> 24 + 8 = 32. etc...).
  - '=' (equal) sign:
    - If there are no operators doesn't have an effect
    - If there is an operator performs the operation and add the rightOperand into the operation display. 
      The result is displayed into the current display. If continued to press then it takes the result and uses that as
      the leftOperand, keeping the rightOperand invariate.
  - 'C'  : clears everything and bring back to initial state
  - 'CE' : bring back the current display to 0:
    - If the user was entering the rightOperand then clears that to 0
    - If the user was entering the leftOperand then clears that
    - If a result was already present then it clears that (the operator and the rightOperand remain)
  - '<--' (backspace) : remove only 1 digit from the input (also clear the operation display)
*/


function add(a, b) {
  return a + b;
}

/* How to handle division by 0?
   * Leave the Infinity return, or return a string 'Cannot divide by 0'?
   */
function divide(a, b) {
  return a / b;
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
// For now doesn't include keyboard input
function isValidInput(input) {
  const validSigns = ['CE', 'C', 'backspace', '/', 'x', '-', '+', '=', '.', '+/-'];
  return validSigns.includes(input) || (+input >= 0 && +input <= 9) ? true : false;
}

// Returns true if the input is one of the 4 operators available (equal not included)
function isOperator(input) {
  return (['/', 'x', '-', '+'].includes(input)) ? true : false
}


function multiply(a, b) {
  return a * b;
}


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
    default:
      return 'operation not supported';
  }
}


function subtract(a, b) {
  return a - b;
}

// Update what is shown in the current display (the bigger one in the bottom part)
// When the display is updated also the rightOperand variable is updated
function updateDisplay(input) {
  if (isAppendableInput(input, currentDisplay.innerText)) {
      if (currentDisplay.innerText === '0') {
        currentDisplay.innerText = input;
      } else {
        currentDisplay.innerText += input;
      }
      rightOperand = currentDisplay.innerText;
    }
}