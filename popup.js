let modeEnabled = false;

document.getElementById('toggle-mode').addEventListener('click', () => {
  modeEnabled = !modeEnabled;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: toggleMode,
      args: [modeEnabled]
    });
  });

  document.getElementById('toggle-mode').textContent = modeEnabled
    ? 'Disable Disability Experience Mode'
    : 'Enable Disability Experience Mode';
});

function toggleMode(isEnabled) {
  if (isEnabled) {
    document.getElementById('disability-mode-button').click();
  }
}
