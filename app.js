/*
    Calcunox Pro - Ultimate Engineering Calculator
    Copyright (c) 2025 Calcunox Team
    Created by: Priyanshu Aryan Panda
    All rights reserved.
*/

class Calculator {
    constructor(container) {
        this.container = container;
        this.display = container.querySelector('.current-input');
        this.preview = container.querySelector('.history'); // Operation preview
        this.current = '0';
        this.prev = '';
        this.operation = null;
        this.angleMode = 'DEG';
        this.baseMode = 'DEC';
        this.resultDisplayed = false;
        this.listenersAdded = false;
        this.init();
    }

    init() {
        if (this.listenersAdded) return;
        this.listenersAdded = true;

        this.container.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleButton(e.target));
            btn.addEventListener('mousedown', this.createRipple);
        });
    }

    handleButton(btn) {
        const action = btn.dataset.action;
        const number = btn.dataset.number;

        if (number) this.handleNumber(number);
        else if (action) this.handleAction(action);

        this.updateDisplay();
    }

    handleNumber(num) {
        if (this.resultDisplayed) {
            this.current = num;
            this.resultDisplayed = false;
        } else {
            this.current = this.current === '0' ? num : this.current + num;
        }
    }

    handleAction(action) {
        if (this.resultDisplayed) {
            if (['+', '-', '*', '/', '^', 'mod'].includes(action)) {
                this.prev = this.current;
                this.operation = action;
                this.current = '';
                this.resultDisplayed = false;
                this.updatePreview();
                return;
            }
            this.resultDisplayed = false;
        }

        switch (action) {
            case 'clear':
                this.clear();
                break;
            case 'backspace':
                this.backspace();
                break;
            case '=':
                this.calculate();
                break;
            case 'percent':
                this.percent();
                break;
            case '±':
                this.negate();
                break;
            case '.':
                this.addDecimal();
                break;
            case 'sin':
            case 'cos':
            case 'tan':
            case 'log':
            case 'ln':
            case 'sqrt':
            case 'pi':
            case 'e':
            case '^':
            case '!':
            case 'rad':
            case 'deg':
                this.handleScientific(action);
                break;
            case 'bin':
            case 'oct':
            case 'dec':
            case 'hex':
            case 'hyp':
            case 'mod':
            case 'clr':
                this.handleEngineering(action);
                break;
            default:
                this.setOperation(action);
        }
    }

    setOperation(op) {
        if (this.current === '') return;
        if (this.prev !== '') this.calculate();
        this.operation = op;
        this.prev = this.current;
        this.current = '';
        this.updatePreview();
    }

    calculate() {
        if (!this.operation || this.current === '') return;

        const a = parseFloat(this.prev);
        const b = parseFloat(this.current);
        let result;

        switch (this.operation) {
            case '+':
                result = a + b;
                break;
            case '-':
                result = a - b;
                break;
            case '*':
                result = a * b;
                break;
            case '/':
                result = b !== 0 ? a / b : 'Error';
                break;
            case '^':
                result = Math.pow(a, b);
                break;
            case 'mod':
                result = a % b;
                break;
        }

        this.current = result === 'Error' || isNaN(result) ? 'Error' :
            Number.isInteger(result) ? result.toString() : parseFloat(result.toFixed(8)).toString();
        this.operation = null;
        this.prev = '';
        this.resultDisplayed = true;
        this.updatePreview();
    }

    clear() {
        this.current = '0';
        this.prev = '';
        this.operation = null;
        this.resultDisplayed = false;
        this.updatePreview();
    }

    backspace() {
        if (!this.resultDisplayed) {
            this.current = this.current.slice(0, -1) || '0';
        }
    }

    percent() {
        this.current = (parseFloat(this.current) / 100).toString();
    }

    negate() {
        this.current = (-parseFloat(this.current)).toString();
    }

    addDecimal() {
        if (!this.current.includes('.')) {
            this.current = this.current === '' ? '0.' : this.current + '.';
        }
    }

    handleScientific(action) {
        const val = parseFloat(this.current);
        if (isNaN(val) && !['pi', 'e', 'rad', 'deg'].includes(action)) return;

        switch (action) {
            case 'sin':
                this.current = Math.sin(this.angleMode === 'DEG' ? val * Math.PI / 180 : val).toString();
                break;
            case 'cos':
                this.current = Math.cos(this.angleMode === 'DEG' ? val * Math.PI / 180 : val).toString();
                break;
            case 'tan':
                this.current = Math.tan(this.angleMode === 'DEG' ? val * Math.PI / 180 : val).toString();
                break;
            case 'log':
                this.current = val > 0 ? Math.log10(val).toString() : 'Error';
                break;
            case 'ln':
                this.current = val > 0 ? Math.log(val).toString() : 'Error';
                break;
            case 'sqrt':
                this.current = val >= 0 ? Math.sqrt(val).toString() : 'Error';
                break;
            case 'pi':
                this.current = Math.PI.toString();
                break;
            case 'e':
                this.current = Math.E.toString();
                break;
            case '^':
                this.operation = '^';
                this.prev = this.current;
                this.current = '';
                this.updatePreview();
                break;
            case '!':
                this.current = this.factorial(val).toString();
                break;
            case 'rad':
                this.angleMode = 'RAD';
                break;
            case 'deg':
                this.angleMode = 'DEG';
                break;
        }
    }

    factorial(n) {
        if (n < 0 || !Number.isInteger(n)) return NaN;
        let res = 1;
        for (let i = 2; i <= n; i++) res *= i;
        return res;
    }

    handleEngineering(action) {
        switch (action) {
            case 'bin':
                this.current = parseInt(this.current, this._currentBase()).toString(2);
                this.baseMode = 'BIN';
                break;
            case 'oct':
                this.current = parseInt(this.current, this._currentBase()).toString(8);
                this.baseMode = 'OCT';
                break;
            case 'dec':
                this.current = parseInt(this.current, this._currentBase()).toString(10);
                this.baseMode = 'DEC';
                break;
            case 'hex':
                this.current = parseInt(this.current, this._currentBase()).toString(16).toUpperCase();
                this.baseMode = 'HEX';
                break;
            case 'hyp':
                const a = parseFloat(this.prev);
                const b = parseFloat(this.current);
                this.current = Math.hypot(a, b).toString();
                break;
            case 'mod':
                this.operation = 'mod';
                this.prev = this.current;
                this.current = '';
                this.updatePreview();
                break;
            case 'clr':
                this.clear();
                this.baseMode = 'DEC';
                break;
        }
    }

    _currentBase() {
        switch (this.baseMode) {
            case 'BIN':
                return 2;
            case 'OCT':
                return 8;
            case 'HEX':
                return 16;
            default:
                return 10;
        }
    }

    updateDisplay() {
        this.display.value = this.current === '' ? '0' : this.current;
        this.updatePreview();
    }

    updatePreview() {
        if (this.preview) {
            if (this.prev && this.operation) {
                let op = this.operation;
                if (op === '*') op = '×';
                if (op === '/') op = '÷';
                this.preview.innerHTML = `<sub>${this.prev} ${op}</sub>`;
            } else {
                this.preview.innerHTML = '';
            }
        }
    }

    createRipple(e) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        ripple.style.left = `${e.offsetX}px`;
        ripple.style.top = `${e.offsetY}px`;
        e.currentTarget.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    handleKey(e) {
        const keyMap = {
            'Enter': '=',
            'Escape': 'clear',
            'Backspace': 'backspace',
            '%': 'percent',
            '/': '/',
            '*': '*',
            '-': '-',
            '+': '+',
            '.': '.'
        };

        if (keyMap[e.key]) {
            this.handleAction(keyMap[e.key]);
        } else if (e.key >= '0' && e.key <= '9') {
            this.handleNumber(e.key);
        }
        this.updateDisplay();
    }
}

class App {
    constructor() {
        this.calculators = new Map();
        this.activeCalc = null;
        this.init();
    }

    init() {
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab));
        });

        document.querySelectorAll('.btn-convert-small').forEach(btn => {
            btn.addEventListener('click', (e) => this.convertNumber(e.target));
        });

        document.addEventListener('keydown', (e) => {
            if (this.activeCalc) this.activeCalc.handleKey(e);
        });

        this.switchTab(document.querySelector('.tab.active'));
    }

    switchTab(tab) {
        const viewId = tab.dataset.view;
        document.querySelectorAll('.tab, .calculator-view').forEach(el => {
            el.classList.remove('active');
        });

        tab.classList.add('active');
        const view = document.querySelector(`.calculator-view[data-view="${viewId}"]`);
        view.classList.add('active');

        if (!this.calculators.has(viewId)) {
            this.calculators.set(viewId, new Calculator(view));
        }
        this.activeCalc = this.calculators.get(viewId);
        this.activeCalc.updateDisplay();
    }

    convertNumber(btn) {
        const type = btn.dataset.convert;
        const inputs = {
            hex: document.getElementById('hex-input'),
            dec: document.getElementById('dec-input'),
            bin: document.getElementById('bin-input'),
            oct: document.getElementById('oct-input')
        };

        const value = inputs[type].value;
        if (!value) return;

        const baseMap = { hex: 16, dec: 10, bin: 2, oct: 8 };
        const num = parseInt(value, baseMap[type]);

        if (isNaN(num)) {
            Object.values(inputs).forEach(input => input.value = '');
            return;
        }

        inputs.hex.value = num.toString(16).toUpperCase();
        inputs.dec.value = num.toString(10);
        inputs.bin.value = num.toString(2);
        inputs.oct.value = num.toString(8);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new App();
});