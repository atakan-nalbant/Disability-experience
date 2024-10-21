// Create a button for the Disability Experience Mode
let button = document.createElement('button');
button.id = 'disability-mode-button';
button.innerText = 'Enable Disability Experience Mode';
button.style.position = 'fixed';
button.style.top = '10px';
button.style.left = '10px';
button.style.zIndex = '9999';
button.style.padding = '10px';
button.style.backgroundColor = '#007BFF';
button.style.color = '#fff';
button.style.border = 'none';
button.style.borderRadius = '5px';
button.style.cursor = 'pointer';

document.body.appendChild(button);

let isModeEnabled = false;

// Check if the mode was previously enabled and apply it
chrome.storage.sync.get(['disabilityModeEnabled'], function (result) {
    if (result.disabilityModeEnabled) {
        enableDisabilityMode();
    } else {
        // If disabled, make sure it remains disabled and no test is run
        disableDisabilityMode();
    }
});

button.addEventListener('click', function () {
    isModeEnabled = !isModeEnabled;
    if (isModeEnabled) {
        enableDisabilityMode();
        // Store the mode as enabled
        chrome.storage.sync.set({ disabilityModeEnabled: true });
    } else {
        disableDisabilityMode();
        // Store the mode as disabled
        chrome.storage.sync.set({ disabilityModeEnabled: false });
    }
});

function enableDisabilityMode() {
    button.innerText = 'Disable Disability Experience Mode';
    injectAxeCoreScript(); // Axe Core is only injected if the mode is enabled
}

function disableDisabilityMode() {
    button.innerText = 'Enable Disability Experience Mode';
    // Ensure Axe Core is not injected or run
    isModeEnabled = false; // No need to inject or run the test when disabled
    // Do not reload the page automatically in this case, just stop further actions
}

function injectAxeCoreScript() {
    // Inject Axe Core and run the test only if the mode is enabled
    chrome.runtime.sendMessage({ action: "injectAxe" }, (response) => {
        if (response.success) {
            console.log('Axe Core injected successfully');
            runAxeTest(); // Proceed to run the test only if Axe Core is successfully injected
        } else {
            console.error('Axe Core injection failed');
        }
    });
}

function runAxeTest() {
    // Ensure the mode is enabled before running the test
    if (!isModeEnabled) {
        return; // Do not run the test if the mode is disabled
    }

    chrome.runtime.sendMessage({ action: "runAxeTest" }, (response) => {
        if (response.success && response.results) {
            response.results.violations.forEach(function (violation) {
                violation.nodes.forEach(function (node) {
                    var elements = document.querySelectorAll(node.target);
                    elements.forEach(function (element) {
                        element.style.backgroundColor = 'red';  // Highlight the element in red
                        element.style.color = 'transparent';    // Hide text content
                        element.style.backgroundImage = 'none'; // Remove background images
                        element.style.border = 'none';          // Remove borders
                    });
                });
            });
        } else if (response.error) {
            console.error(response.error);
        }
    });
}
