// Calculator functionality
let calcDisplay = document.getElementById('calcDisplay');
let currentValue = '0';
let previousValue = '';
let operation = null;

function appendNumber(num) {
    if (currentValue === '0') {
        currentValue = num;
    } else {
        currentValue += num;
    }
    updateDisplay();
}

function appendOperator(op) {
    if (operation !== null) {
        calculate();
    }
    previousValue = currentValue;
    operation = op;
    currentValue = '0';
}

function clearDisplay() {
    currentValue = '0';
    previousValue = '';
    operation = null;
    updateDisplay();
}

function deleteLast() {
    if (currentValue.length > 1) {
        currentValue = currentValue.slice(0, -1);
    } else {
        currentValue = '0';
    }
    updateDisplay();
}

function calculate() {
    if (operation === null || previousValue === '') {
        return;
    }

    let result;
    const prev = parseFloat(previousValue);
    const current = parseFloat(currentValue);

    switch (operation) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            result = current !== 0 ? prev / current : 0;
            break;
        default:
            return;
    }

    currentValue = result.toString();
    operation = null;
    previousValue = '';
    updateDisplay();
}

function updateDisplay() {
    calcDisplay.value = currentValue;
}

// Unit Converter functionality
const conversionTypes = {
    length: {
        from: 'miles',
        to: 'km',
        units: {
            miles: 'Miles',
            km: 'Kilometers'
        },
        convert: (value, from, to) => {
            const miles = from === 'miles' ? value : value / 1.60934;
            return to === 'km' ? miles * 1.60934 : miles;
        }
    },
    temperature: {
        from: 'fahrenheit',
        to: 'celsius',
        units: {
            fahrenheit: 'Fahrenheit',
            celsius: 'Celsius'
        },
        convert: (value, from, to) => {
            if (from === 'fahrenheit' && to === 'celsius') {
                return (value - 32) * 5 / 9;
            } else if (from === 'celsius' && to === 'fahrenheit') {
                return (value * 9 / 5) + 32;
            }
            return value;
        }
    },
    weight: {
        from: 'pounds',
        to: 'kg',
        units: {
            pounds: 'Pounds',
            kg: 'Kilograms'
        },
        convert: (value, from, to) => {
            const kg = from === 'pounds' ? value / 2.20462 : value;
            return to === 'kg' ? kg : kg * 2.20462;
        }
    },
    volume: {
        from: 'gallons',
        to: 'liters',
        units: {
            gallons: 'Gallons',
            liters: 'Liters'
        },
        convert: (value, from, to) => {
            const liters = from === 'gallons' ? value * 3.78541 : value;
            return to === 'liters' ? liters : liters / 3.78541;
        }
    }
};

function updateConversionOptions() {
    const type = document.getElementById('conversionType').value;
    const convType = conversionTypes[type];
    const fromUnit = document.getElementById('fromUnit');
    const toUnit = document.getElementById('toUnit');

    fromUnit.innerHTML = '';
    for (const [key, label] of Object.entries(convType.units)) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = label;
        fromUnit.appendChild(option);
    }

    fromUnit.value = convType.from;
    toUnit.textContent = convType.units[convType.to];
    convertValue();
}

function convertValue() {
    const type = document.getElementById('conversionType').value;
    const input = parseFloat(document.getElementById('inputValue').value);
    const fromUnit = document.getElementById('fromUnit').value;
    const output = document.getElementById('outputValue');

    if (isNaN(input) || input === '') {
        output.value = '';
        return;
    }

    const convType = conversionTypes[type];
    const toUnit = fromUnit === convType.from ? convType.to : convType.from;
    
    const result = convType.convert(input, fromUnit, toUnit);
    output.value = result.toFixed(4);
}

function resetConverter() {
    document.getElementById('inputValue').value = '';
    document.getElementById('outputValue').value = '';
    document.getElementById('conversionType').value = 'length';
    updateConversionOptions();
}

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.getAttribute('data-tab');
        
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(tabName).classList.add('active');
    });
});

// Initialize
updateConversionOptions();
