// Reusable function for autocomplete dropdown menu
const createAutoComplete = ({
    root,
    renderOption,
    onOptionSelect,
    inputValue,
    fetchData
}) => {
    // Root HTML for search input and dropdown
    root.innerHTML = `
        <label><b>Search</b></label>
        <input type="text" class="input">
        <div class="dropdown">
            <div class="dropdown-menu">
                <div class="dropdown-content results"></div>
            </div>
        </div>
    `;

    const input = root.querySelector('input');
    const dropdown = root.querySelector('.dropdown');
    const resultsWrapper = root.querySelector('.results');

    const onInput = async event => {
        const items = await fetchData(event.target.value);

        // Close dropdown if there are no search results
        if (!items.length) {
            dropdown.classList.remove('is-active');
            return;
        }

        // Render dropdown
        resultsWrapper.innerHTML = '';
        dropdown.classList.add('is-active');
        for (let item of items) {
            const option = document.createElement('a');
            

            option.classList.add('dropdown-item');
            option.innerHTML = renderOption(item);
            // When user clicks on an item option from dropdown
            option.addEventListener('click', () => {
                // Close dropdown
                dropdown.classList.remove('is-active');
                // Update the input to the exact item title
                input.value = inputValue(item);
                onOptionSelect(item);
            });

            resultsWrapper.appendChild(option);
        }
    };

    // Wait 500ms to run onIput after user stops typing into search input
    input.addEventListener('input', debounce(onInput, 500));

    // Close dropdown if user clicks outside of the dropdown
    document.addEventListener('click', event => {
        if (!root.contains(event.target)) {
            dropdown.classList.remove('is-active');
        }
    });
};