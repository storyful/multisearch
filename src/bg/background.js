chrome.browserAction.onClicked.addListener( function(){
  chrome.tabs.query({ currentWindow: true, windowType: "normal", active : true }, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id, { text: "toggle_overlay" });
  });  
});

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.text && (msg.text == "toggle_overlay")) {
    chrome.tabs.query({ currentWindow: true, windowType: "normal", active : true }, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id, { text: "toggle_overlay" });
    });    
  } else if (msg.text && (msg.text == "search")) {
    chrome.tabs.create({ url: 'http://storyful.com?utm=multisearch', active: false }, function(tab) {
      chrome.tabs.executeScript(tab.id, { runAt: 'document_start', code: msg.script });
    });
  } else {
    chrome.tabs.query({ currentWindow: true, windowType: "normal", active : true }, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id, msg);
    });
  }
});