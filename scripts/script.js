let leftNumber;
let rightNumber;
let operator;


function add(a, b) {
  return a + b;
}


function divide(a, b) {
  /* How to handle division by 0?
   * Leave the Infinity return, or return a string 'Cannot divide by 0'?
   */
  return a / b;
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
    case '*':
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







