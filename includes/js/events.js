// Events
// Scroll snap for the PS4
ui.mainContainer.addEventListener('scroll', () => {
    // Only apply if using a PS4
    if (user.platform != "PS4" || !ui.initialScreen) return;
    if (ui.mainContainer.scrollTop > lastScrollY) {
        // scrolling down
        if (lastSection !== "exploit") {
            document.getElementById('exploitContainer').scrollIntoView({ block: "end" });
            lastSection = "exploit";
        }
    } else if (ui.mainContainer.scrollTop < lastScrollY) {
        // scrolling up
        if (lastSection !== "initial") {
            ui.initialScreen.scrollIntoView({ block: "end" });
            lastSection = "initial";
        }
    }
    lastScrollY = ui.mainContainer.scrollTop;
});

// Launch jailbreak
ui.exploitRunBtn.addEventListener('click', () => {
    autoStartExploit();
});


// تابع اجرای اصلی
function autoStartExploit() {
    if (user.blockJailbreak) return;
    user.blockJailbreak = true;
    sessionStorage.setItem('autoExploit', 'true');
    if (typeof chooseHEN === 'function') chooseHEN();
    if (typeof jailbreak === 'function') jailbreak();
}


// گوش دادن به کلیک دستی
ui.psLogoContainer.addEventListener('click', () => {
    autoStartExploit();
});



// منطق اجرای خودکار فقط بعد از آماده شدن کش
function checkCacheAndRun() {
    if (window.applicationCache) {
        if (
            window.applicationCache.status === window.applicationCache.IDLE ||
            window.applicationCache.status === window.applicationCache.UPDATEREADY
        ) {
            setTimeout(autoStartExploit, 2000);
        } else if (
            window.applicationCache.status === window.applicationCache.DOWNLOADING ||
            window.applicationCache.status === window.applicationCache.CHECKING
        ) {
            window.applicationCache.addEventListener('noupdate', () => {
                setTimeout(autoStartExploit, 2000);
            }, { once: true });

            window.applicationCache.addEventListener('cached', () => {
                setTimeout(autoStartExploit, 2000);
            }, { once: true });

            window.applicationCache.addEventListener('updateready', () => {
                setTimeout(autoStartExploit, 2000);
            }, { once: true });
        }
    } else {
        setTimeout(autoStartExploit, 2000);
    }
}

checkCacheAndRun();



// tabs switching
ui.toolsTab.addEventListener('click', () => {
    if (ui.toolsSection.classList.contains('hidden')) {
        ui.toolsSection.classList.remove('hidden');
        ui.linuxSection.classList.add('hidden');
        ui.advancedPayloadsSection.classList.add('hidden');
        ui.customPayloadsSection.classList.add('hidden');

        ui.toolsTab.setAttribute("aria-selected", "true");
        ui.linuxTab.setAttribute("aria-selected", "false");
        ui.advancedPayloadsTab.setAttribute("aria-selected", "false");
        ui.customPayloadsTab.setAttribute("aria-selected", "false");

        ui.toolsSection.innerHTML = '';
        renderPayloads(payloadsList.filter(p => p.category === 'tools'));
    }
    ui.payloadsList.scrollTop = 0;
    // Update lastTap
    saveLastTab('tools');
})

ui.linuxTab.addEventListener('click', () => {
    if (ui.linuxSection.classList.contains('hidden')) {
        ui.toolsSection.classList.add('hidden');
        ui.linuxSection.classList.remove('hidden');
        ui.advancedPayloadsSection.classList.add('hidden');
        ui.customPayloadsSection.classList.add('hidden');

        ui.toolsTab.setAttribute("aria-selected", "false");
        ui.linuxTab.setAttribute("aria-selected", "true");
        ui.advancedPayloadsTab.setAttribute("aria-selected", "false");
        ui.customPayloadsTab.setAttribute("aria-selected", "false");

        ui.linuxSection.innerHTML = '';
        renderPayloads(payloadsList.filter(p => p.category === 'linux'));
    }
    ui.payloadsList.scrollTop = 0;
    // Update lastTap
    saveLastTab('linux');
});

ui.advancedPayloadsTab.addEventListener('click', () => {
    if (ui.advancedPayloadsSection.classList.contains('hidden')) {
        ui.toolsSection.classList.add('hidden');
        ui.linuxSection.classList.add('hidden');
        ui.advancedPayloadsSection.classList.remove('hidden');
        ui.customPayloadsSection.classList.add('hidden');

        ui.toolsTab.setAttribute("aria-selected", "false");
        ui.linuxTab.setAttribute("aria-selected", "false");
        ui.advancedPayloadsTab.setAttribute("aria-selected", "true");
        ui.customPayloadsTab.setAttribute("aria-selected", "false");

        ui.advancedPayloadsSection.innerHTML = '';
        renderPayloads(payloadsList.filter(p => p.category === 'advanced'));
    }
    ui.payloadsList.scrollTop = 0;
    // Update lastTap
    saveLastTab('advanced');

});

ui.customPayloadsTab.addEventListener('click', () => {
    if (ui.customPayloadsSection.classList.contains('hidden')) {
        ui.toolsSection.classList.add('hidden');
        ui.linuxSection.classList.add('hidden');
        ui.advancedPayloadsSection.classList.add('hidden');
        ui.customPayloadsSection.classList.remove('hidden');

        ui.toolsTab.setAttribute("aria-selected", "false");
        ui.linuxTab.setAttribute("aria-selected", "false");
        ui.advancedPayloadsTab.setAttribute("aria-selected", "false");
        ui.customPayloadsTab.setAttribute("aria-selected", "true");
    }
    ui.payloadsList.scrollTop = 0;
    // Update lastTap
    saveLastTab('custom');

});

// Save ps4Fw from select element (Only for communicating external device -> PS4 for local network)
ui.ps4FwSelect.addEventListener('change', function () {
    user.ps4Fw = ui.ps4FwSelect.value;
    localStorage.setItem('ps4Fw', ui.ps4FwSelect.value);
    ui.ps4FwSelect.style.border = "1px solid white";
})

// Stop the auto jailbreak retry on button click
ui.stopAutoJbBtn.addEventListener('click', () => {
    clearInterval(autoJbInterval);
    sessionStorage.setItem('autoJbRetry', false);
    ui.stopAutoJbBtn.classList.toggle('hidden');
    if (localStorage.getItem("theme") == "compact") {
        ui.clickToStartText.textContent = window.lang.title || "PSFree Enhanced";
    } else ui.clickToStartText.textContent = window.lang.clickToStart;
});

// turn off auto settings tab clicker after the user clicks close for the first time.
document.getElementById("close-settings").addEventListener('click', function () {
    if (localStorage.getItem("NewUser") != "0") {
        localStorage.setItem("NewUser", "0");
    }
});
