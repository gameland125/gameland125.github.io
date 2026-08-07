# Gameland 129 - Final Patch List

Scope: UI/PWA structural fix only. No exploit/payload logic changes.

## 1) index.html
- Fix broken script path:
  - from: <script type="module" src="index.js"></script>
  - to:   <script src="includes/js/index.js"></script>

## 2) Service Worker registration (optional but recommended for PWA)
Add before </body>:
```html
<script>
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('./includes/js/sw.js');
  });
}
</script>
```

## 3) Canonical script paths
Use only these paths in HTML/boot flow:
- includes/js/payloadsList.js
- includes/js/design.js
- includes/js/language.js
- includes/js/HENs.js
- includes/js/checkFw.js
- includes/js/autoJbRetry.js
- includes/js/events.js
- includes/js/index.js
- includes/js/sw.js

## 4) Manifest alignment
Keep PSFree.manifest pointing to the real canonical paths, especially:
- includes/js/index.js

## 5) Do not change
- CSS inline theme styling in index.html
- exploit source files under src/
- payload logic and GoldHEN execution flow

## 6) Files to keep in package
- index.html
- PSFree.manifest
- includes/js/index.js
- includes/js/sw.js
- includes/css/layouts/index.css
- includes/css/colors/default.css
