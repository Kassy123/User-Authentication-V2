(function() {
    if (window.hasRun) {
      return;
    }
    window.hasRun = true;
    window.browser = (function() {
      return window.msBrowser || chrome;
    })();
    let downloadButton = document.getElementById("downloadButton");
    downloadButton.addEventListener("click", function() {
        window.browser.runtime.sendMessage({
            message: "feedback",
        });
    });
})();