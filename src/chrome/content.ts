import { ChromeMessage, ChromeMessageResponse } from "../types";
let currSize=0;
let response:ChromeMessageResponse;
const observer = new PerformanceObserver((list) => {

  list.getEntries().forEach((entry) => {
    let temp=JSON.stringify(entry)
    let entryObj = JSON.parse(temp)
    currSize+=entryObj.transferSize
    console.log(entryObj.name+" "+entryObj.transferSize+" "+currSize)
    response = {
        transferSize: currSize
    };
    console.log(response)
  });
});

observer.observe({ type: "resource", buffered: true });



const messagesFromReactAppListener = (message: ChromeMessage, sender: chrome.runtime.MessageSender, sendResponse: (response: ChromeMessageResponse) => void) => {
    
    console.log('[content.js]. Message received', {
        message,
        sender,
    })


    sendResponse(response);
}

/**
 * Fired when a message is sent from either an extension process or a content script.
 */
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);