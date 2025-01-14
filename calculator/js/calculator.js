/* jshint esversion: 8 */
/* jshint browser: true */
'use strict';

var outputScreen;
var clearOnEntry;


/**
 * Display a digit on the `outputScreen`
 * 
 * @param {number} digit digit to add or display on the `outputScreen`
 */
function enterDigit(digit) {
    if (clearOnEntry) {
        outputScreen.innerText = '';
        clearOnEntry = false;
    }
    outputScreen.innerText += digit;
}



/**
 * Clear `outputScreen` and set value to 0
 */
function clear_screen() {
    outputScreen.innerText= '0';
    clearOnEntry = true}


/**
 * Evaluate the expression and display its result or *ERROR*
 */
function eval_expr() {
    try {
        const result = eval(outputScreen.innerText);
        outputScreen.innerText = result.toString();
    } catch (error) {
        outputScreen.innerText = 'ERROR';
    }
}



/**
 * Display an operation on the `outputScreen`
 * 
 * @param {string} operation to add to the expression
 */
function enterOp(operation) {
    if (!clearOnEntry) {
        outputScreen.innerText += operation;
        clearOnEntry = false;
    }
}


window.onload = function () {
    outputScreen = document.querySelector("#result");
    outputScreen.innerText ='0';
    clearOnEntry = true;
};
