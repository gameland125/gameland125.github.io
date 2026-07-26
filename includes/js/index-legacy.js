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
  defaultOp
