/* Replace the existing DLProgress and DisplayCacheProgress functions with these. */
function DLProgress(e) {
  var total = Number(e && e.total) || 0;
  var loaded = Number(e && e.loaded) || 0;
  var percent = total > 0 ? Math.min(100, Math.round(loaded / total * 100)) : 0;
  var progressEl = document.getElementById("cache-progress");

  if (progressEl) {
    progressEl.textContent = percent + "%";
    progressEl.setAttribute("aria-label", "Caching " + percent + "%");
  }
}

function DisplayCacheProgress() {
  var progressEl = document.getElementById("cache-progress");
  if (progressEl) {
    progressEl.textContent = "100%";
    progressEl.classList.add("cache-complete");
  }
}
