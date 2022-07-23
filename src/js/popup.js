const announcement = document.getElementById("announcement");
const copyQueryStringButton = document.getElementById("copy-query-string-button");

let markdownOutput;
let markdownOutputNoQueryString;
let output;

copyQueryStringButton.addEventListener("click", () => {
    copyQueryStringButton.dataset.status = (copyQueryStringButton.dataset.status === "enabled") ? "disabled" : "enabled";

    chrome.storage.local.set({ copyQueryStringStatus: copyQueryStringButton.dataset.status }, () => {
        if (copyQueryStringButton.dataset.status === "enabled") {
            announcement.textContent = "New link has been copied to clipboard,\r\nwith query string (if any).";
            output = markdownOutput;
            copyQueryStringButton.textContent = "Copy link without query string";
        } else {
            announcement.textContent = "New link has been copied to clipboard,\r\nwithout query string.";
            output = markdownOutputNoQueryString;
            copyQueryStringButton.textContent = "Copy link with query string";
        };
        setTimeout(() => {
            navigator.clipboard.writeText(output);
        }, "300");
    })
});

async function readLocalStorage(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(key, (data) => {
            if (data[key] === undefined) {
                reject("không thấy");
            } else {
                resolve(data[key])
            }
        })
    })
}

(async function () {
    const copyQueryStringStatus = await readLocalStorage("copyQueryStringStatus");

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    const tabUrl = tab.url;
    const tabTitle = tab.title;
        
    markdownOutput = `[${tabTitle}](${tabUrl})`;
    markdownOutputNoQueryString = markdownOutput.split("?")[0] + ")";

    copyQueryStringButton.dataset.status = copyQueryStringStatus;

    if (copyQueryStringStatus === "enabled") {
        copyQueryStringButton.textContent = "Copy link without query string";
        output = markdownOutput;
        announcement.textContent = "Link has been copied to clipboard,\r\nwith query string (if any).";
    } else {
        copyQueryStringButton.textContent = "Copy link with query string";
        output = markdownOutputNoQueryString;
        announcement.textContent = "Link has been copied to clipboard,\r\nwithout query string.";
    }

    setTimeout(() => {
        navigator.clipboard.writeText(output);
    }, "300");
})();