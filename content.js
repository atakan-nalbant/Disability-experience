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

button.addEventListener('click', function () {
    isModeEnabled = !isModeEnabled;
    button.innerText = isModeEnabled
        ? 'Disable Disability Experience Mode'
        : 'Enable Disability Experience Mode';

    if (isModeEnabled) {
        // Inject axe.min.js and run the test within the page context
        injectAxeCoreScript();
    } else {
        location.reload(); // Reload the page to reset
    }
});

function injectAxeCoreScript() {
    chrome.runtime.sendMessage({action: "injectAxe"}, (response) => {
        if (response.success) {
            console.log('Axe Core injected successfully');
            runAxeTest();
        } else {
            console.error('Axe Core injection failed');
        }
    });
}

function runAxeTest() {
    chrome.runtime.sendMessage({action: "runAxeTest"}, (response) => {
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
