document.getElementById("shortUrl").addEventListener("click", shortenUrl);

function shortenUrl() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const curTab = tabs[0];
        chrome.tabs.create({ url: 'https://kort.app/?url=' + btoa(curTab.url) });
    });
}

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const curTab = tabs[0];
    if (curTab.url.toLowerCase().includes('kort.app')) {
        document.getElementById('shortUrl').classList.add("hidden");
        document.getElementById('warning').classList.remove("hidden");
    }
});