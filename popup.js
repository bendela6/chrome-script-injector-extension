document.getElementById("injectButton").addEventListener("click", function () {
  console.log("injectButton clicked");
  chrome.tabs.query({
    active: true,
    currentWindow: true,
  }, function (tabs) {
    void chrome.tabs.sendMessage(tabs[0].id, {
      action: "injectScript",
    });
  });
});
