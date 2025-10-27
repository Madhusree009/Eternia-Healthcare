document.addEventListener('DOMContentLoaded', () => {
    // DOM element references
    const tableBody = document.querySelector('#todo-table tbody');
    const addRowButton = document.querySelector('#add-row-button');
    const nameInput = document.querySelector('#doctor-name-input');
    const numberInput = document.querySelector('#doctor-number-input');
    const areaInput = document.querySelector('#area-input');
    const rowCountSpan = document.querySelector('#row-count');
    const limitMessage = document.querySelector('.limit-message');

    const MAX_ROWS = 160;

    // --- Helper Functions ---

    /**
     * Checks if the given string represents a valid 10-digit phone number.
     * It removes common non-digit characters (spaces, dashes, parentheses) before checking length.
     * @param {string} numberString - The phone number input string.
     * @returns {boolean} True if the cleaned string is exactly 10 digits, false otherwise.
     */
    function isValidPhoneNumber(numberString) {
        // Remove spaces, dashes, and parentheses to check for 10 core digits
        const cleanedNumber = numberString.replace(/[\s\-\(\)]/g, '');
        
        // Use a regular expression to check if it consists of exactly 10 digits
        // You could also just check the length: cleanedNumber.length === 10
        return /^\d{10}$/.test(cleanedNumber);
    }

    /**
     * Updates the row count displayed on the page.
     */
    function updateRowCount() {
        const currentRowCount = tableBody.children.length;
        rowCountSpan.textContent = currentRowCount;

        // Check if the limit has been reached
        if (currentRowCount >= MAX_ROWS) {
            limitMessage.classList.add('limit-reached');
            addRowButton.disabled = true;
            addRowButton.textContent = 'Limit Reached';
        } else {
            limitMessage.classList.remove('limit-reached');
            addRowButton.disabled = false;
            addRowButton.textContent = 'Add Appointment';
        }
    }

    /**
     * Creates a new row for the todo list.
     * @param {string} name - Doctor's Name
     * @param {string} number - Doctor's Number
     * @param {string} area - Area
     * @returns {HTMLTableRowElement} The newly created table row.
     */
    function createNewRow(name, number, area) {
        const newRow = document.createElement('tr');

        // Column 1: Doctor's Name
        const nameCell = document.createElement('td');
        nameCell.textContent = name;
        nameCell.setAttribute('data-label', "Doctor's Name"); 

        // Column 2: Doctor's Number
        const numberCell = document.createElement('td');
        numberCell.textContent = number;
        numberCell.setAttribute('data-label', "Doctor's Number"); 

        // Column 3: Area
        const areaCell = document.createElement('td');
        areaCell.textContent = area;
        areaCell.setAttribute('data-label', "Area"); 

        // Column 4: Check Button
        const buttonCell = document.createElement('td');
        buttonCell.setAttribute('data-label', "Done"); 
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button', 'unchecked');
        checkButton.textContent = '☐';
        checkButton.addEventListener('click', toggleCheck);
        buttonCell.appendChild(checkButton);

        // Append cells to the row
        newRow.appendChild(nameCell);
        newRow.appendChild(numberCell);
        newRow.appendChild(areaCell);
        newRow.appendChild(buttonCell);

        return newRow;
    }

    /**
     * Event handler for the check button. Toggles its state.
     * @param {Event} event - The click event.
     */
    function toggleCheck(event) {
        const button = event.target;
        if (button.classList.contains('unchecked')) {
            // Change to checked state (Orange background)
            button.classList.remove('unchecked');
            button.classList.add('checked');
            button.textContent = '✔';
            // Optional: Visually mark the entire row as complete
            button.closest('tr').style.opacity = '0.6';
        } else {
            // Change to unchecked state (Ocean Blue border)
            button.classList.remove('checked');
            button.classList.add('unchecked');
            button.textContent = '☐';
            button.closest('tr').style.opacity = '1';
        }
    }


    // --- Main Logic ---

    /**
     * Handles the click event for the "Add Appointment" button.
     */
    function handleAddRow() {
        const name = nameInput.value.trim();
        const number = numberInput.value.trim();
        const area = areaInput.value.trim();

        // 1. Basic validation: Ensure all fields are filled
        if (!name || !number || !area) {
            alert('Please fill in all three fields to add an appointment.');
            return;
        }

        // 2. NEW: Phone number validation
        if (!isValidPhoneNumber(number)) {
            alert('The Doctor\'s Number must be a valid 10-digit number (dashes or spaces are allowed but only 10 digits total).');
            return;
        }

        // 3. Check for the maximum row limit
        if (tableBody.children.length < MAX_ROWS) {
            const newRow = createNewRow(name, number, area);
            tableBody.appendChild(newRow);

            // Clear the input fields
            nameInput.value = '';
            numberInput.value = '';
            areaInput.value = '';

            updateRowCount(); // Update the counter after adding
        }
    }

    // --- Event Listeners and Initial Setup ---

    // 1. Add row on button click
    addRowButton.addEventListener('click', handleAddRow);

    // 2. Allow adding row by pressing 'Enter' in the input fields
    [nameInput, numberInput, areaInput].forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleAddRow();
            }
        });
    });

    // 3. Initialize event listeners and data-labels for the existing example row
    document.querySelectorAll('#todo-table tbody tr').forEach(row => {
        row.children[0].setAttribute('data-label', "Doctor's Name");
        row.children[1].setAttribute('data-label', "Doctor's Number");
        row.children[2].setAttribute('data-label', "Area");
        row.children[3].setAttribute('data-label', "Done");
    });

    document.querySelectorAll('.check-button').forEach(button => {
        button.addEventListener('click', toggleCheck);
    });

    // 4. Initial row count update
    updateRowCount();
});
