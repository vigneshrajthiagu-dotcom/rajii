const display = document.getElementById('display');
const result = document.getElementById('result');

const buttons = document.querySelectorAll('.buttons button');

const letterMap = {
    M: 1, E: 2, R: 3, C: 4, H: 5, A: 6, N: 7, T: 8, S: 9, K: 0
};

// Add letters/operators
buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        const val = btn.getAttribute('data-value');
        if(val) {
            const start = display.selectionStart;
            const end = display.selectionEnd;
            display.value = display.value.slice(0, start) + val + display.value.slice(end);
            display.focus();
            display.selectionStart = display.selectionEnd = start + val.length;
            calculate();
        }
    });
});

// Clear all
document.getElementById('clear').addEventListener('click', () => {
    display.value = '';
    result.textContent = '0';
});

// Erase at cursor
document.getElementById('erase').addEventListener('click', () => {
    const start = display.selectionStart;
    const end = display.selectionEnd;
    if(start === end && start > 0){
        display.value = display.value.slice(0, start-1) + display.value.slice(end);
        display.selectionStart = display.selectionEnd = start-1;
    } else if(start !== end){
        display.value = display.value.slice(0, start) + display.value.slice(end);
        display.selectionStart = display.selectionEnd = start;
    }
    calculate();
    display.focus();
});

// Equals button
document.getElementById('equals').addEventListener('click', calculate);

// Calculate function
function calculate() {
    const input = display.value.toUpperCase();
    if(input.trim() === '') {
        result.textContent = '0';
        return;
    }

    let expression = '';
    for(let ch of input){
        if(letterMap[ch] !== undefined){
            expression += letterMap[ch];
        } else if(['+','-','*','/'].includes(ch)){
            expression += ch;
        }
    }

    try {
        let total = Math.round(eval(expression));

        const p10 = Math.round(total * 1.1);
        const p20 = Math.round(total * 1.2);
        const p30 = Math.round(total * 1.3);
        const p40 = Math.round(total * 1.4);
        const p50 = Math.round(total * 1.5);

        result.textContent =
            `${total} | +10%: ${p10} | +20%: ${p20} | +30%: ${p30} | +40%: ${p40} | +50%: ${p50}`;
    } catch {
        result.textContent = 'Error';
    }
}

// Allow keyboard erase
display.addEventListener('keydown', e => {
    if(e.key === 'Backspace'){
        setTimeout(calculate, 0);
    }
});

// Recalculate on manual input
display.addEventListener('input', calculate);
