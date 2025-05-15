let display = document.getElementById('display');
let currentInput = '';

function updateDisplay() {
    display.value = currentInput === '' ? '0' : currentInput;
}

function appendNumber(number) {
    if (currentInput === '0') {
        currentInput = number;
    } else {
        currentInput += number;
    }
    updateDisplay();
}

function appendOperator(operator) {
    if (currentInput === '') return;
    if (['+', '-', '*', '/'].includes(currentInput.slice(-1))) return;
    currentInput += operator;
    updateDisplay();
}

function appendDecimal() {
    if (currentInput.includes('.')) return;
    currentInput += '.';
    updateDisplay();
}

function clearDisplay() {
    currentInput = '';
    updateDisplay();
}

function deleteLast() {
    currentInput = currentInput.slice(0, -1);
    updateDisplay();
}

function calculate() {
    try {
        currentInput = eval(currentInput).toString(); // Be cautious with eval()
        updateDisplay();
    } catch (error) {
        display.value = 'Error';
        currentInput = '';
    }
}

// Initial display update
updateDisplay();