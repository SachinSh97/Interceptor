chrome.action.onClicked.addListener(async (tab) => {
	await chrome.tabs.create({ url: 'index.html' });
});
