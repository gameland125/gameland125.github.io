Gameland patch

هدف این patch:
- رفع خطای ReferenceError مربوط به autoJailbreak
- جلوگیری از خطا در صورت تعریف نشدن loadSettings
- حفظ UI و منطق فعلی پروژه بدون بازنویسی کامل index.html

فایل ها:
1) index.html.patch-snippet.html
   این snippet را قبل از اولین scriptهای پروژه در index.html اضافه کنید.

2) includes/js/autoJbRetry.js
   نسخه اصلاح شده با fallback برای autoJailbreak و autoJbInterval.

3) includes/js/cacheGate.js
   helper حداقلی برای checkCacheAndRun در حالت cache-first.

4) sw.js
   سرویس ورکر ساده cache-first.

5) manifest.json
   مانيفست مینیمال PWA.

نکته:
چون فقط index.html فعلی در اختیار بود و فایل های داخلی includes/js در آپلود موجود نبودند،
این بسته به صورت patch تحویل شده تا روی پروژه اصلی شما اعمال شود.
