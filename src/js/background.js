chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({copyQueryStringStatus: "enabled"});
})