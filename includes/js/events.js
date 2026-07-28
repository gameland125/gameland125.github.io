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
    if (user.blockJailbreak) return;
    user.blockJailbreak = true;
    chooseHEN();
    jailbreak();
});

// تعریف یک تابع برای اجرای خودکار و ایمن اکسپلویت
function autoStartExploit() {
    // اگر از قبل اکسپلویت در حال اجراست یا مسدود شده، متوقف شود
    if (user.blockJailbreak) return;
    
    user.blockJailbreak = true;
    
    // انتخاب نسخه هِن و اجرای اکسپلویت به صورت خودکار
    if (typeof chooseHEN === 'function') chooseHEN();
    if (typeof jailbreak === 'function') jailbreak();
}

// گوش دادن به کلیک روی لوگو (برای حالت دستی در صورت نیاز)
ui.psLogoContainer.addEventListener('click', () => {
    autoStartExploit();
});

// اجرای خودکار تایمر و اکسپلویت به محض لود شدن کامل صفحه
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(autoStartExploit, 1500); // تأخیر ۱.۵ ثانیه‌ای برای پایداری اولیه سیستم
    });
} else {
    setTimeout(autoStartExploit, 1500);
}


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
