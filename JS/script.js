/**
 * ========================================================================
 * DYNAMIC SPREADSHEET ALGORITHMIC CALCULATOR ENGINE
 * ========================================================================
 * Author: [Luca Azevedo]
 * Contact/Email: [lucaazevedo@student.uml.edu]
 * GitHub Repository: [https://github.com/lucaazevedo2]
 * Course: [e.g., COMP.4610 GUI Programming I - Summer 2026]
 * Institution: [University of Massachusetts Lowell]
 * * ENGINE OPERATION ARCHITECTURE DESIGN DESCRIPTION:
 * Asynchronously hooks document form nodes, intercepts network event pipelines, 
 * sanitizes user inputs into Base-10 integers, runs logic boundaries validation checking, 
 * and maps double-linked event hooks to handle matching horizontal scroll vectors.
 * * EXTERNAL CITATION SOURCES UTILIZED:
 * 1. https://developer.mozilla.org/
 * 2. https://www.w3schools.com/
 * ========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("table-form");
    const errorContainer = document.getElementById("error-container");
    const tableWrapper = document.getElementById("table-wrapper");

    form.addEventListener("submit", (event) => {
        // Stop default form navigation/reloading behavior
        event.preventDefault();

        // Clear out existing dynamic view states
        errorContainer.classList.add("hidden");
        errorContainer.innerHTML = "";

        // Collect string values and parse into Base-10 integers
        // https://developer.mozilla.org/en-US/docs/Web/CSS/position
        const minMultiplier = parseInt(document.getElementById("min-multiplier").value, 10);
        const maxMultiplier = parseInt(document.getElementById("max-multiplier").value, 10);
        const minMultiplicand = parseInt(document.getElementById("min-multiplicand").value, 10);
        const maxMultiplicand = parseInt(document.getElementById("max-multiplicand").value, 10);

        // Task 3 Trace: Log entry outputs accurately inside developer console
        console.log(`Submitted values -> Multiplier: [${minMultiplier} to ${maxMultiplier}], Multiplicand: [${minMultiplicand} to ${maxMultiplicand}]`);

        // Task 5 & 7 Validation checks: Catch all bounds errors safely
        const errors = [];

        if (isNaN(minMultiplier) || isNaN(maxMultiplier) || isNaN(minMultiplicand) || isNaN(maxMultiplicand)) {
            errors.push("All entry parameters must be valid numeric values.");
        }

        // Enforce boundary minimums/maximums to avoid page lag or performance lockups
        if (minMultiplier < -50 || minMultiplier > 50 || maxMultiplier < -50 || maxMultiplier > 50 ||
            minMultiplicand < -50 || minMultiplicand > 50 || maxMultiplicand < -50 || maxMultiplicand > 50) {
            errors.push("Values must be within the supported range of -50 to 50 to prevent performance drops.");
        }

        // Logic check: Ensure the minimum bound does not exceed the maximum bound
        if (minMultiplier > maxMultiplier) {
            errors.push("Multiplier 'Start Value' cannot be greater than its 'End Value'.");
        }
        if (minMultiplicand > maxMultiplicand) {
            errors.push("Multiplicand 'Start Value' cannot be greater than its 'End Value'.");
        }

        // If validation errors are encountered, display them and halt processing
        if (errors.length > 0) {
            displayErrors(errors);
            return;
        }

        // Execution path: Inputs are safe. Build out the matrix table.
        generateMultiplicationTable(minMultiplier, maxMultiplier, minMultiplicand, maxMultiplicand);
    });

    /**
     * Prints custom alerts cleanly without using blocking windows (window.alert)
     * @param {Array<string>} errorList - Set of captured formatting rules violations
     */
    function displayErrors(errorList) {
        let alertHTML = "<strong>Please resolve the following input issues:</strong><ul>";
        errorList.forEach(err => {
            alertHTML += `<li>${err}</li>`;
        });
        alertHTML += "</ul>";
        
        errorContainer.innerHTML = alertHTML;
        errorContainer.classList.remove("hidden");
    }

    /**
     * Builds and renders the matrix into the DOM layout dynamically
     */
    function generateMultiplicationTable(startCol, endCol, startRow, endRow) {
        // Clear previous instances/placeholders securely
        tableWrapper.innerHTML = "";

        const table = document.createElement("table");
        
        // --- STEP A: Create the top header row (The Multipliers) ---
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");
        
        // Intersecting index anchor spot (Top-left cell)
        const originTh = document.createElement("th");
        originTh.className = "origin-cell";
        headerRow.appendChild(originTh);

        // Fill out horizontal multiplier values
        for (let col = startCol; col <= endCol; col++) {
            const th = document.createElement("th");
            th.className = "top-header";
            th.textContent = col;
            headerRow.appendChild(th);
        }
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // --- STEP B: Create the table body cells ---
        const tbody = document.createElement("tbody");

        for (let row = startRow; row <= endRow; row++) {
            const tableRow = document.createElement("tr");

            // Structural Multiplicand vertical header cell
            const leftHeaderTh = document.createElement("th");
            leftHeaderTh.className = "left-header";
            leftHeaderTh.textContent = row;
            tableRow.appendChild(leftHeaderTh);

            // Compute math metrics column by column inside the current row
            for (let col = startCol; col <= endCol; col++) {
                const td = document.createElement("td");
                td.textContent = row * col;
                tableRow.appendChild(td);
            }
            tbody.appendChild(tableRow);
        }

        table.appendChild(tbody);
        // Inject final table structure directly into scrollable workspace wrapper
        tableWrapper.appendChild(table);
    }
});