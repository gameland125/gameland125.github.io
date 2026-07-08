function loadPayload(path) {
    fetch(path)
    .then(res => res.arrayBuffer())
    .then(buf => {
        console.log("Payload loaded:", path);
        // اجرای واقعی payload توسط exploit انجام میشه
    })
    .catch(err => {
        alert("Payload load failed");
        console.error(err);
    });
}
