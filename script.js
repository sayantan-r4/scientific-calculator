// script.js

const inputBox = document.getElementById('inputBox');
const buttons = document.querySelectorAll('button');
const toggleAdvanced = document.getElementById('toggleAdvanced');
const advancedPanel = document.getElementById('advancedPanel');
const mainPanel = document.getElementById('mainPanel');
const degRadToggle = document.getElementById('degRadToggle');

// State variables
let expression = '';   // stores raw expression (e.g., "asin(1)")
let degrees = true;    // default mode = Degrees

// --- Panel Toggling ---
toggleAdvanced.addEventListener('click', () => {
    advancedPanel.classList.toggle('hidden');
    toggleAdvanced.textContent = advancedPanel.classList.contains('hidden') ? 'Adv' : 'Back';
});

document.addEventListener('click', (event) => {
    if (!advancedPanel.classList.contains('hidden') &&
        !advancedPanel.contains(event.target) &&
        !mainPanel.contains(event.target) &&
        event.target !== toggleAdvanced &&
        !toggleAdvanced.contains(event.target)) {
        advancedPanel.classList.add('hidden');
        toggleAdvanced.textContent = 'Adv';
    }
});

// --- Custom math functions for Degrees ---
function loadMathFunctions() {
    math.import({
        sinDeg: x => Math.sin(x * Math.PI / 180),
        cosDeg: x => Math.cos(x * Math.PI / 180),
        tanDeg: x => Math.tan(x * Math.PI / 180),
        asinDeg: x => Math.asin(x) * 180 / Math.PI,
        acosDeg: x => Math.acos(x) * 180 / Math.PI,
        atanDeg: x => Math.atan(x) * 180 / Math.PI,
    }, { override: true });
}
loadMathFunctions();

// --- Evaluate Function ---
function evaluateExpression() {
    try {
        let evalExpression = expression
            .replace(/x/g, '*')
            .replace(/÷/g, '/')
            .replace(/\^/g, '^')
            .replace(/(\d+(\.\d+)?)%/g, '($1 / 100)')
            .replace(/(\d+)!/g, 'factorial($1)')
            .replace(/π/g, 'pi')
            .replace(/e/g, 'e')
            .replace(/ln\(/g, 'log(')
            .replace(/√\(/g, 'sqrt(')
            .replace(/nCr\(/g, 'combinations(')
            .replace(/nPr\(/g, 'permutations(');

        if (degrees) {
            evalExpression = evalExpression
                .replace(/sin\(/g, 'sinDeg(')
                .replace(/cos\(/g, 'cosDeg(')
                .replace(/tan\(/g, 'tanDeg(')
                .replace(/asin\(/g, 'asinDeg(')
                .replace(/acos\(/g, 'acosDeg(')
                .replace(/atan\(/g, 'atanDeg(');
        }

        console.log("Evaluating:", evalExpression);

        const result = math.evaluate(evalExpression);

        if (result === undefined || isNaN(result) || !isFinite(result)) {
            inputBox.value = 'Error';
        } else {
            inputBox.value = Number(result.toFixed(8));
        }
    } catch (error) {
        inputBox.value = 'Error';
        console.error('Evaluation error:', error.message);
    }
}

// --- Deg/Rad Toggle ---
degRadToggle.addEventListener('click', () => {
    degrees = !degrees;
    degRadToggle.textContent = degrees ? 'Deg' : 'Rad';

    // Re-evaluate current expression (not the last result!)
    if (expression.trim() !== '') {
        evaluateExpression();
    }
});

// --- Button Handling ---
buttons.forEach(button => {
    if (button === toggleAdvanced || button === degRadToggle || button.classList.contains('empty')) {
        return;
    }

    button.addEventListener('click', () => {
        const value = button.textContent;

        try {
            if (value === 'C') {
                expression = '';
                inputBox.value = '0';
            } else if (value === 'DEL') {
                expression = expression.slice(0, -1);
                inputBox.value = expression || '0';
            } else if (value === '=') {
                evaluateExpression();
            } else {
                if (value === '!' || value === '%') {
                    const lastChar = expression.slice(-1);
                    if (/\d/.test(lastChar) || lastChar === ')') {
                        expression += value;
                    }
                } else {
                    expression += value;
                }
                inputBox.value = expression;
            }
        } catch (error) {
            inputBox.value = 'Error';
            expression = '';
            console.error('Evaluation error:', error.message);
        }
    });
});
