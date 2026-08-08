async function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }
function getScript(source) {
  return new Promise((resolve, reject) => {
    const gs = document.createElement('script');
    gs.src = source;
    gs.async = false;
    gs.onload = () => resolve();
    gs.onerror = () => reject(new Error('Script load failed: ' + source));
    document.body.appendChild(gs);
  });
}
async function loadScript(script_js) {
  window.script_loaded = 0;
  await getScript(script_js);
  let tries = 0;
  while (window.script_loaded < 1 && tries < 80) {
    await sleep(50);
    tries++;
  }
}
