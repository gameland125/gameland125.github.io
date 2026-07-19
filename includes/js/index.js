// ... (کدهای قبل از تابع badHoistJailbreak)

async function badHoistJailbreak() {
  if (window.entrypoint672_result < 1) {
    log("An error occured during Bad Hoist Entrypoint\nRetrying..", "orange");
    await sleep(2000);
    location.reload();
    return;
  }
  else
    log("Bad Hoist Entrypoint succeeded");
  if (window.exploitsetup672_result < 1) {
    log("An error occured during Exploit Setup\nPlease refresh page and try again...", "red");
    return;
  }
  else
    log("Exploit Setup complete\n");
  log("Starting Kernel Exploit...");
  await sleep(200); // Wait 200ms

  await loadScript('./includes/js/exploits/672kexploit.js');
  var result = KernelExploit672();

  if (result === 0 || result === 91) {
    log("\nKernel exploit succeeded", "green");
    // Inject HEN payload
    getPayload672(sessionStorage.getItem('payload_path')); // بارگذاری Payload (GoldHEN)

    log("\nBad Hoist by Fire30, 6.7x Kernel Exploit by Sleirsgoevy");
    log("Implementation taken from Feyzee61");

    // --- اجرای خودکار GoldHEN و ریدایرکت مخفی ---
    // نام تابع loadGoldHEN یا هر اسم دیگری که GoldHEN را فعال می‌کند
    if (typeof loadGoldHEN === 'function') { // بررسی وجود تابع
      loadGoldHEN();
    } else {
      console.error("loadGoldHEN function is not defined!");
      // در صورت عدم وجود تابع، می‌توانید یک هشدار نشان دهید یا کار دیگری انجام دهید
      // alert("GoldHEN could not be loaded automatically.");
    }

    // تاخیر کوتاه برای ارسال فرمان و سپس ریدایرکت مخفی
    setTimeout(() => {
      window.location.replace("about:blank");
    }, 1000); // 1 ثانیه تاخیر
    // --- پایان تغییرات ---

  } else if (result === 179) {
    getPayload672(sessionStorage.getItem('payload_path'));

    log("\nAlready jailbroken, skipping..", "green");

    // --- اجرای خودکار GoldHEN و ریدایرکت برای حالت Already jailbroken ---
    if (typeof loadGoldHEN === 'function') { // بررسی وجود تابع
      loadGoldHEN();
    } else {
      console.error("loadGoldHEN function is not defined!");
    }
    setTimeout(() => {
      window.location.replace("about:blank");
    }, 1000);
    // --- پایان تغییرات ---

  } else {
    log("\nAn error occured during Kernel Exploit\nPlease restart console and try again...", "red");
  }
}

// ... (کدهای بعد از تابع badHoistJailbreak)
