/* jshint esversion: 8 */
/* jshint node: true */
/* jshint browser: true */
'use strict';


/**
 * Greet user by name
 * 
 * @param {string} name visitor's name
 * @param {string} selector element to use for display
 */
function greet(name, selector) {
    document.querySelector(selector).innerText = `Hello, ${name}!`;
}


/**
 * Check if a number is prime
 * 
 * @param {number} number number to check
 * @return {boolean} result of the check
 */
function isPrime(number) {
    if (number <= 1) return false;
    for (let i = 2; i <= Math.sqrt(number); i++) {
        if (number % i === 0) return false;
    }
    return true;
}


/**
 * Print whether a number is prime
 * 
 * @param {number} number number to check
 * @param {string} selector element to use for display
 */
function printNumberInfo(number, selector) {
    const message = isPrime(number) ? `${number} is a prime number.` : `${number} is not a prime number.`;
document.querySelector(selector).innerText = message;}


/**
 * Generate an array of prime numbers
 * 
 * @param {number} number number of primes to generate
 * @return {number[]} an array of `number` prime numbers
 */
function getNPrimes(number) {
    const primes = [];
    let count = 0;
    let candidate = 2;

    while (count < number) {
        if (isPrime(candidate)) {
            primes.push(candidate);
            count++;
        }
        candidate++;
    }
    return primes;}


/**
 * Print a table of prime numbers
 * 
 * @param {number} number number of primes to display
 * @param {string} selector element to use for display
 */
function printNPrimes(number, selector) {
    const primes = getNPrimes(number);
    const tbody = document.querySelector(`${selector} tbody`);
    tbody.innerHTML = ''; // Clear existing table

    primes.forEach(prime => {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.innerText = prime;
        row.appendChild(cell);
        tbody.appendChild(row);
    });}


/**
 * Display warning about missing URL query parameters
 * 
 * @param {Object} urlParams URL parameters
 * @param {string} selector element to use for display
 */
function displayWarnings(urlParams, selector) {const warnings = [];
    if (!urlParams.has('name')) {
        warnings.push("Name parameter is missing. Using default: 'student'.");
    }
    if (!urlParams.has('number')) {
        warnings.push("Number parameter is missing. Using default: '330'.");
    }
    if (warnings.length > 0) {
        document.querySelector(selector).innerText = warnings.join(' ');
    }}

window.onload = function () {
    // TODO: Initialize the following variables
    let urlParams = new URLSearchParams(window.location.search);
    let name = urlParams.get('name') || 'student';
    let number = parseInt(urlParams.get('number')) || 330;
    this.displayWarnings(urlParams, "#warnings");
    greet(name, "#greeting");
    printNumberInfo(number, "#numberInfo");
    printNPrimes(number, "table#nPrimes");
};

document.addEventListener('DOMContentLoaded', () => {
    (document.querySelectorAll('.notification .delete') || []).forEach(($delete) => {
      const $notification = $delete.parentNode;
  
      $delete.addEventListener('click', () => {
        $notification.parentNode.removeChild($notification);
      });
    });
  });
  