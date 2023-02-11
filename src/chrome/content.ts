import { ChromeMessage, ChromeMessageResponse } from "../types";
let currSize=0;
let response:ChromeMessageResponse;

window.addEventListener("load", function() {
  console.log("In fn")

  const performance = window.performance;
  if (!performance) {
    console.log("Not supported by browser");
    return;
  }

  const resources =  performance.getEntriesByType("resource");
  let totalSent = 0

  resources.forEach(resource => {
    let temp=JSON.stringify(resource)
    let entryObj = JSON.parse(temp)
    console.log(resource.name +" "+entryObj.transferSize)
    totalSent += entryObj.transferSize;
  });
  response = {
    transferSize: totalSent
};

  console.log(`Resource sent data: ${totalSent} bytes`);
  console.log(response)
});

// const observer = new PerformanceObserver((list) => {

//   list.getEntries().forEach((entry) => {
//     let temp=JSON.stringify(entry)
//     let entryObj = JSON.parse(temp)
//     let prev=currSize
//     currSize+=entryObj.transferSize
//     console.log(entryObj.name+" "+entryObj.transferSize+" "+currSize)
//     response = {
//         transferSize: currSize
//     };
//     console.log(response)
//   });
// });

// observer.observe({ type: "resource", buffered: true });



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