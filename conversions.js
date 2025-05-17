/*
    Calcunox Pro - Ultimate Engineering Calculator
    Copyright (c) 2025 Calcunox Team
    Created by: Priyanshu Aryan Panda
    All rights reserved.
*/

window.addEventListener('DOMContentLoaded', () => {
    // Conversion data for each type
    const conversionData = {
        length: {
            units: ['meter', 'kilometer', 'centimeter', 'millimeter', 'mile', 'yard', 'foot', 'inch'],
            factors: {
                meter: 1,
                kilometer: 1000,
                centimeter: 0.01,
                millimeter: 0.001,
                mile: 1609.34,
                yard: 0.9144,
                foot: 0.3048,
                inch: 0.0254
            }
        },
        area: {
            units: ['sqmeter', 'sqkilometer', 'sqcentimeter', 'sqmillimeter', 'sqmile', 'sqyard', 'sqfoot', 'sqinch', 'hectare', 'acre'],
            factors: {
                sqmeter: 1,
                sqkilometer: 1e6,
                sqcentimeter: 0.0001,
                sqmillimeter: 0.000001,
                sqmile: 2.59e6,
                sqyard: 0.836127,
                sqfoot: 0.092903,
                sqinch: 0.00064516,
                hectare: 10000,
                acre: 4046.86
            }
        },
        volume: {
            units: ['liter', 'milliliter', 'cubicmeter', 'cubiccentimeter', 'gallon', 'quart', 'pint', 'cup', 'fluidounce'],
            factors: {
                liter: 1,
                milliliter: 0.001,
                cubicmeter: 1000,
                cubiccentimeter: 0.001,
                gallon: 3.78541,
                quart: 0.946353,
                pint: 0.473176,
                cup: 0.24,
                fluidounce: 0.0295735
            }
        },
        weight: {
            units: ['kilogram', 'gram', 'milligram', 'ton', 'pound', 'ounce'],
            factors: {
                kilogram: 1,
                gram: 0.001,
                milligram: 0.000001,
                ton: 1000,
                pound: 0.453592,
                ounce: 0.0283495
            }
        },
        temperature: {
            units: ['celsius', 'fahrenheit', 'kelvin'],
            convert: (value, from, to) => {
                if (from === to) return value;
                let celsius;
                switch (from) {
                    case 'celsius':
                        celsius = value;
                        break;
                    case 'fahrenheit':
                        celsius = (value - 32) * 5 / 9;
                        break;
                    case 'kelvin':
                        celsius = value - 273.15;
                        break;
                }
                switch (to) {
                    case 'celsius':
                        return celsius;
                    case 'fahrenheit':
                        return (celsius * 9 / 5) + 32;
                    case 'kelvin':
                        return celsius + 273.15;
                }
            }
        },
        currency: {
            units: ['USD', 'EUR', 'GBP', 'JPY', 'INR', 'CAD', 'AUD', 'CHF', 'CNY', 'HKD'],
            rates: {
                USD: 1,
                EUR: 0.92,
                GBP: 0.79,
                JPY: 148.3,
                INR: 83.12,
                CAD: 1.36,
                AUD: 1.48,
                CHF: 0.88,
                CNY: 7.24,
                HKD: 7.82
            }
        },
        time: {
            units: ['second', 'minute', 'hour', 'day', 'week', 'month', 'year'],
            factors: {
                second: 1,
                minute: 60,
                hour: 3600,
                day: 86400,
                week: 604800,
                month: 2.628e6,
                year: 3.154e7
            }
        }
    };

    // DOM references
    const categorySelect = document.getElementById('conversion-category');
    const inputUnit = document.getElementById('input-unit');
    const outputUnit = document.getElementById('output-unit');
    const inputValue = document.getElementById('input-value');
    const outputValue = document.getElementById('output-value');
    const convertBtn = document.querySelector('.btn-convert');

    // Utility to prettify unit names
    function formatUnit(unit) {
        const map = {
            sqmeter: "m²",
            sqkilometer: "km²",
            sqcentimeter: "cm²",
            sqmillimeter: "mm²",
            sqmile: "mi²",
            sqyard: "yd²",
            sqfoot: "ft²",
            sqinch: "in²",
            hectare: "ha",
            acre: "acre",
            cubicmeter: "m³",
            cubiccentimeter: "cm³",
        };
        return map[unit] || unit.charAt(0).toUpperCase() + unit.slice(1);
    }

    // Update units for selected category
    function updateUnits() {
        const category = categorySelect.value;
        const units = conversionData[category].units;
        inputUnit.innerHTML = units.map(unit => `<option value="${unit}">${formatUnit(unit)}</option>`).join('');
        outputUnit.innerHTML = units.map(unit => `<option value="${unit}">${formatUnit(unit)}</option>`).join('');
    }

    // Perform conversion
    function performConversion() {
        const category = categorySelect.value;
        const fromUnit = inputUnit.value;
        const toUnit = outputUnit.value;
        const val = parseFloat(inputValue.value);

        if (isNaN(val)) {
            outputValue.value = "Invalid";
            return;
        }

        let result;
        if (category === 'temperature') {
            result = conversionData.temperature.convert(val, fromUnit, toUnit);
        } else if (category === 'currency') {
            const rates = conversionData.currency.rates;
            result = val * (rates[toUnit] / rates[fromUnit]);
        } else {
            const factorFrom = conversionData[category].factors[fromUnit];
            const factorTo = conversionData[category].factors[toUnit];
            result = val * (factorFrom / factorTo);
        }
        outputValue.value = (result !== undefined && !isNaN(result)) ? parseFloat(result.toFixed(8)) : "Error";
    }

    // Event listeners
    categorySelect.addEventListener('change', updateUnits);
    convertBtn.addEventListener('click', performConversion);

    // Initialize on page load
    updateUnits();
});