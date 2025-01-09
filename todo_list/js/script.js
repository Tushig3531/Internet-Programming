"use strict;";

var team = ["Aardvark", "Beaver", "Cheetah", "Dolphin", "Elephant", "Flamingo", "Giraffe", "Hippo"];
var priority = ["Low", "Normal", "Important", "Critical"];

/**
 * Add a new task to the list
 */
function addTask() {
    let title = document.getElementById("title").value;
    let assignedTo = document.getElementById("assignedTo").value;
    let priority = document.getElementById("priority").value;
    let dueDate = document.getElementById("dueDate").value;

    document.getElementById("feedbackMessage"),innerTest="";

    if(!title || !dueDate){
        document.getElementById("feedbackMessage").innerHTML = "Fill out title and due date";
        return;
    }
    let vals = [title, assignedTo, priority, dueDate];
    addRow(vals, document.getElementById("taskList").getElementsByTagName("tbody")[0]);
    document.getElementById("newTask").reset();
}

/**
 * Add a new row to the table
 */
function addRow(valueList, parent) {
    let row = document.createElement("tr");

    // Create a checkbox for removing the row
    let tdCheckbox = document.createElement("td");
    let cb = document.createElement("input");
    cb.type = "checkbox";
    cb.onclick = function() { removeRow(this); };
    tdCheckbox.appendChild(cb);
    row.appendChild(tdCheckbox);

    valueList.forEach((value, index) => {
        let td = document.createElement("td");
        td.textContent = value;

        if (index === 2) { 
            td.classList.add(value.toLowerCase());
            row.classList.add(value.toLowerCase())
        }
        
        row.appendChild(td);
    });

    parent.appendChild(row);
}

/**
 * Remove a table row corresponding to the selected checkbox
 */
function removeRow(checkbox) {
    if (checkbox.checked) {
        let row = checkbox.parentNode.parentNode;
        row.parentNode.removeChild(row);
    }
}

/**
 * Clear all tasks from the list
 */
function clearAllTasks() {
    let tbody = document.getElementById("taskList").getElementsByTagName("tbody")[0];
    tbody.innerHTML = ''; 
}

/**
 * Select or deselect all checkboxes in the task list
 */
function selectAll(checkbox) {
    let checkboxes = document.querySelectorAll("#taskList tbody input[type='checkbox']");
    checkboxes.forEach((cb) => {
        cb.checked = checkbox.checked;
    });
}

/**
 * Add options to the specified element
 */
function populateSelect(selectId, sList) {
    console.log(sList); 
    if (!Array.isArray(sList)) {
        console.error("Expected an array but got:", sList);
        return;
    }

    let sel = document.getElementById(selectId);
    sel.innerHTML = '';
    sList.forEach(item => {
        let option = document.createElement("option");
        option.value = item;
        option.textContent = item;
        sel.appendChild(option);
    });
}

window.onload = function () {
    // Populate priority dropdown on page load
    populateSelect("assignedTo",team)
    populateSelect("priority", priority);
};