import { ChromeMessage, ChromeMessageResponse } from "../types";

const messagesFromReactAppListener = (message: ChromeMessage, sender: chrome.runtime.MessageSender, sendResponse: (response: ChromeMessageResponse) => void) => {
    
    console.log('[content.js]. Message received', {
        message,
        sender,
    })
    
    const response: ChromeMessageResponse = {
        text: 'Hello from content.js'
    };
  
    sendResponse(response);
 
}

/**
 * Fired when a message is sent from either an extension process or a content script.
 */
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);