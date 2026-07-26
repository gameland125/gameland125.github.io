// Load settings
async function loadSettings() {
  try {
    CheckFW();
    loadJbFlavor();
    updateLanguage();
    updateDesign();
    await loadSettingsFromStorage();
    renderPayloads(payloadsList);
    loadAdvancedPayloads();
    loadLastTab();
    loadGoldHENVer();
    const runAutoJailbreak = () => autoJailbreak();
    if (window.cacheGate && typeof cacheGate.run === 'function') {
      cacheGate.run(runAutoJailbreak);
    } else {
      runAutoJailbreak();
    }
    updateBareboneJB();
    loadLapseChain();
    userlandOnlyOnJB67x();
  } catch (e) {
    alert("Error in loadSettings: " + e.message);
  }
}

// Load settings from localStorage
async function loadSettingsFromStorage() {
  const settings = JSON.parse(localStorage.getItem('settings') || '{}');
  Object.keys(settings).forEach(key => {
    if (settings[key] !== null) {
      if (key === 'autoJbRetrySwitch') {
        ui.autoJbRetry.checked = settings[key];
        sessionStorage.setItem('autoJbRetry', settings[key]);
      } else if (key === 'selectedLanguage') {
        window.selectedLanguage = settings[key];
      } else if (key === 'selectedDesign') {
        window.selectedDesign = settings[key];
      } else if (key === 'selectedJbFlavor') {
        window.selectedJbFlavor = settings[key];
      } else if (key === 'selectedPayload') {
        window.selectedPayload = settings[key];
      } else if (key === 'selectedAdvancedPayload') {
        window.selectedAdvancedPayload = settings[key];
      } else if (key === 'selectedAutoJbRetryTimeout') {
        window.selectedAutoJbRetryTimeout = settings[key];
      } else if (key === 'selectedLapseChain') {
        window.selectedLapseChain = settings[key];
      } else if (key === 'userlandOnlyOnJB67x') {
        window.userlandOnlyOnJB67x = settings[key];
      } else {
        const element = document.getElementById(key);
        if (element) {
          if (element.type === 'checkbox') {
            element.checked = settings[key];
          } else {
            element.value = settings[key];
          }
        }
      }
    }
  });
}

// Save settings to localStorage
function saveSettings() {
  const settings = {};
  settings.autoJbRetrySwitch = ui.autoJbRetry.checked;
  settings.selectedLanguage = window.selectedLanguage;
  settings.selectedDesign = window.selectedDesign;
  settings.selectedJbFlavor = window.selectedJbFlavor;
  settings.selectedPayload = window.selectedPayload;
  settings.selectedAdvancedPayload = window.selectedAdvancedPayload;
  settings.selectedAutoJbRetryTimeout = window.selectedAutoJbRetryTimeout;
  settings.selectedLapseChain = window.selectedLapseChain;
  settings.userlandOnlyOnJB67x = window.userlandOnlyOnJB67x;

  // Add other settings from input elements
  document.querySelectorAll('input, select, textarea').forEach(element => {
    if (element.id && !settings.hasOwnProperty(element.id)) {
      settings[element.id] = element.value;
    }
  });

  localStorage.setItem('settings', JSON.stringify(settings));
}

// Load available payloads
function loadPayloads() {
  // payloadsList is defined in payloadsList.js
  renderPayloads(payloadsList);
}

// Render payloads in the UI
function renderPayloads(payloads) {
  const payloadsContainer = document.getElementById('payloads');
  payloadsContainer.innerHTML = ''; // Clear previous payloads

  const selectElement = document.createElement('select');
  selectElement.id = 'payloadSelect';
  selectElement.className = 'form-control';

  payloads.forEach(payload => {
    const optionElement = document.createElement('option');
    optionElement.value = payload.file;
    optionElement.textContent = payload.name;
    if (window.selectedPayload === payload.file) {
      optionElement.selected = true;
    }
    selectElement.appendChild(optionElement);
  });

  payloadsContainer.appendChild(selectElement);

  // Add event listener for payload selection change
  selectElement.addEventListener('change', (event) => {
    window.selectedPayload = event.target.value;
    saveSettings();
  });
}

// Load advanced payloads
function loadAdvancedPayloads() {
  const payloadsContainer = document.getElementById('advancedPayloads');
  payloadsContainer.innerHTML = ''; // Clear previous payloads

  const selectElement = document.createElement('select');
  selectElement.id = 'advancedPayloadSelect';
  selectElement.className = 'form-control';

  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = 'Select Payload...';
  if (!window.selectedAdvancedPayload) {
    defaultOption.selected = true;
  }
  selectElement.appendChild(defaultOption);

  // Assuming advancedPayloadsList is globally available or loaded elsewhere
  if (typeof advancedPayloadsList !== 'undefined') {
    advancedPayloadsList.forEach(payload => {
      const optionElement = document.createElement('option');
      optionElement.value = payload.file;
      optionElement.textContent = payload.name;
      if (window.selectedAdvancedPayload === payload.file) {
        optionElement.selected = true;
      }
      selectElement.appendChild(optionElement);
    });
  }

  payloadsContainer.appendChild(selectElement);

  // Add event listener for payload selection change
  selectElement.addEventListener('change', (event) => {
    window.selectedAdvancedPayload = event.target.value;
    saveSettings();
  });
}

// Update UI based on firmware
function CheckFW() {
  if (window.ps4Fw < 6.70 || window.ps4Fw > 9.60) {
    document.getElementById('btn-exploit').disabled = true;
    document.getElementById('btn-exploit-text').textContent = 'Unsupported Firmware';
  } else {
    document.getElementById('btn-exploit').disabled = false;
    document.getElementById('btn-exploit-text').textContent = 'Jailbreak';
  }
}

// Load Jailbreak Flavor
function loadJbFlavor() {
  // Check if window.selectedJbFlavor is defined and is a valid key in lang object
  if (window.selectedJbFlavor && window.lang && window.lang[window.selectedJbFlavor]) {
    document.getElementById('btn-exploit-text').textContent = window.lang[window.selectedJbFlavor];
  } else {
    // Fallback to default if not found or not defined
    document.getElementById('btn-exploit-text').textContent = window.lang.jailbreak;
  }
}

// Update language
function updateLanguage() {
  // Update labels and text content based on selected language
  if (window.lang) {
    document.getElementById('autoJbRetryLabel').textContent = window.lang.autoJbRetry;
    document.getElementById('btn-settings').textContent = window.lang.settings;
    document.getElementById('btn-update').textContent = window.lang.update;
    document.getElementById('btn-restart').textContent = window.lang.restart;
    document.getElementById('btn-continue').textContent = window.lang.continue;
    document.getElementById('btn-error').textContent = window.lang.error;
    document.getElementById('btn-stop-auto-jb').textContent = window.lang.stopAutoJb;
    // Add more labels as needed
  }
}

// Update design
function updateDesign() {
  if (window.selectedDesign && window.designs[window.selectedDesign]) {
    const design = window.designs[window.selectedDesign];
    document.body.style.backgroundColor = design.backgroundColor;
    // Apply other design properties
  }
}

// Update barebone JB status
function updateBareboneJB() {
  const isBarebone = sessionStorage.getItem('isBareboneJb') === 'true';
  if (isBarebone) {
    // Hide irrelevant options for barebone JB
    document.getElementById('autoJbRetry').style.display = 'none';
    document.getElementById('btn-settings').style.display = 'none';
    document.getElementById('payloadSelect').style.display = 'none'; // Hide payload selection for barebone
  }
}

// Load Lapse Chain
function loadLapseChain() {
  const lapseChainContainer = document.getElementById('lapseChainSelectContainer');
  if (!lapseChainContainer) return;

  const selectElement = document.createElement('select');
  selectElement.id = 'lapseChainSelect';
  selectElement.className = 'form-control';

  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = 'Select Lapse Chain...';
  if (!window.selectedLapseChain) {
    defaultOption.selected = true;
  }
  selectElement.appendChild(defaultOption);

  // Assuming lapseChains is globally available or loaded elsewhere
  if (typeof lapseChains !== 'undefined') {
    lapseChains.forEach(chain => {
      const optionElement = document.createElement('option');
      optionElement.value = chain.name;
      optionElement.textContent = chain.name;
      if (window.selectedLapseChain === chain.name) {
        optionElement.selected = true;
      }
      selectElement.appendChild(optionElement);
    });
  }

  lapseChainContainer.appendChild(selectElement);

  // Add event listener for lapse chain selection change
  selectElement.addEventListener('change', (event) => {
    window.selectedLapseChain = event.target.value;
    saveSettings();
  });
}

// Check if Userland Only on JB 6.7x is enabled
function userlandOnlyOnJB67x() {
  const isUserlandOnly = sessionStorage.getItem('userlandOnlyOnJB67x') === 'true';
  if (isUserlandOnly) {
    // Potentially hide or disable options not relevant to this mode
  }
}

// Load last tab
function loadLastTab() {
  const lastTab = localStorage.getItem('lastTab');
  if (lastTab) {
    // Logic to activate the last active tab
    // Example: document.getElementById(lastTab).click();
  }
}

// Load GoldHEN version
function loadGoldHENVer() {
  // Logic to display GoldHEN version if available
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize UI elements and event listeners
  initUI();

  // Load settings
  loadSettings();

  // Set up event listeners for buttons
  document.getElementById('btn-exploit').addEventListener('click', exploit);
  document.getElementById('btn-settings').addEventListener('click', () => {
    // Logic to show settings popup
    alert('Settings popup not implemented yet.');
  });
  document.getElementById('btn-update').addEventListener('click', () => {
    // Logic to trigger update check
    alert('Update functionality not implemented yet.');
  });
  document.getElementById('btn-restart').addEventListener('click', () => {
    // Logic to restart the system or the application
    alert('Restart functionality not implemented yet.');
  });
  document.getElementById('btn-continue').addEventListener('click', () => {
    // Logic to continue after an interruption
    alert('Continue functionality not implemented yet.');
  });
  document.getElementById('btn-error').addEventListener('click', () => {
    // Logic to show error details
    alert('Error details not available.');
  });
  document.getElementById('btn-stop-auto-jb').addEventListener('click', () => {
    sessionStorage.setItem('autoJbRetry', 'false');
    clearInterval(autoJbInterval); // Assuming autoJbInterval is globally defined
    document.getElementById('stopAutoJbBtn').style.display = 'none';
    document.getElementById('clickToStartText').textContent = '';
  });

  // Add listener for autoJbRetrySwitch
  document.getElementById('autoJbRetrySwitch').addEventListener('change', (event) => {
    setAutoJbRetry(event.target.checked);
  });

  // Check for applicationCache status initially
  if (window.applicationCache) {
    window.applicationCache.addEventListener("progress", DLProgress, false);
    window.applicationCache.oncached = function (e) { DisplayCacheProgress(); };
    window.applicationCache.onupdateready = function (e) { DisplayCacheProgress(); };
    window.applicationCache.onnoupdate = function (e) { DisplayCacheProgress(); };
    window.applicationCache.onerror = function (e) { DisplayCacheProgress(); };
  }
});

// Placeholder for UI initialization
function initUI() {
  // Initialize all UI elements here
}

// Placeholder for exploit function
function exploit() {
  console.log('Exploit button clicked');
  // Implement exploit logic here
}

// Placeholder for cache progress display
function DLProgress() {
  // Implement cache progress display logic here
}

// Placeholder for cache status display
function DisplayCacheProgress() {
  // Implement cache status display logic here
}
