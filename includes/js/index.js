
// Fixed Payload Loading Logic
async function loadPayload(payloadUrl) {
    try {
        const response = await fetch(payloadUrl);
        const buffer = await response.arrayBuffer();
        const payload = new Uint8Array(buffer);
        // اطمینان از تزریق موفقیت آمیز
        await window.writePayload(payload);
        console.log("Payload Loaded Successfully");
        document.getElementById("status").innerText = "GoldHEN Executed!";
    } catch (e) {
        console.error("Payload Load Failed", e);
        document.getElementById("status").innerText = "Payload Error";
    }
}

// اتوماسیون خودکار
window.addEventListener('load', async () => {
    // مسیر صحیح فایل شما
    const henPath = 'includes/payloads/GoldHEN/goldhen_v2.4b18.10.bin';
    
    // فرض بر این است که اکسپلویت بعد از لود اجرا می‌شود
    setTimeout(async () => {
        document.getElementById("status").innerText = "Running Exploit...";
        // اینجا تابع اجرای اکسپلویت اصلی شما فراخوانی می‌شود
        await window.runExploit(); 
        
        // بعد از اکسپلویت، تزریق خودکار
        setTimeout(async () => {
             document.getElementById("status").innerText = "Injecting GoldHEN...";
             await loadPayload(henPath);
        }, 2000);
    }, 1000);
});
