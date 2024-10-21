chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'injectAxe') {
        chrome.scripting.executeScript({
            target: {tabId: sender.tab.id},
            files: ['axe.min.js']
        }, () => {
            sendResponse({success: true});
        });
        return true; // Keep the message channel open for sendResponse
    } else if (message.action === 'runAxeTest') {
        chrome.scripting.executeScript({
            target: {tabId: sender.tab.id},
            func: runAxeTestInPageContext
        }, (injectionResults) => {
            if (chrome.runtime.lastError) {
                sendResponse({error: chrome.runtime.lastError.message});
            } else {
                const result = injectionResults[0].result;
                sendResponse({success: true, results: result});
            }
        });
        return true; // Keep the message channel open for sendResponse
    }
});

function runAxeTestInPageContext() {
    return new Promise((resolve, reject) => {
        axe.run((err, results) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}
