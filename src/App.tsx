import React, { useEffect, useState } from "react";
import { ChromeMessage, ChromeMessageResponse } from "./types";

import "./App.css";

function getCookie(cname: string) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

let sessionSet = false

export default function App() {
  const [responseFromContent, setResponseFromContent] = React.useState(0);
  // const [sessionStore,setSessionStore]=React.useState(Number(localStorage.getItem('dataConsumed')) || 0 )

  if(getCookie('dataConsumed')==""){
    document.cookie = "dataConsumed=0";
  }
  

  const [sessionStore,setSessionStore]=React.useState(Number(getCookie('dataConsumed')) )
  // const [prevSessionStore,setPrevSessionStore]=React.useState(0)

  console.log("curr session "+sessionStore);

  // console.log("curr session "+sessionStore);
  // chrome.storage.local.set({ key: "value" }).then(() => {
  //   console.log("Value is set to ");
  // });

  
  React.useEffect(() => {
    /**
     * We can't use "chrome.runtime.sendMessage" for sending messages from React.
     * For sending messages from React we need to specify which tab to send it to.
     */
    chrome.tabs &&
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true,
        },
        (tabs) => {
          chrome.tabs.sendMessage(
            tabs[0].id || 0,
            { type: "GET_DOM" } as ChromeMessage,
            (response: ChromeMessageResponse) => {
              console.log(response);
              let currPageSize = response.transferSize;
              let totalSize = sessionStore
              console.log("currPageSize "+currPageSize+" responseFromContent "+responseFromContent)
              if(!sessionSet && currPageSize!=0){
              totalSize += currPageSize;
                sessionSet = true
            }

              setResponseFromContent(currPageSize);
              // setPrevSessionStore(currPageSize)

              setSessionStore(totalSize);
              document.cookie = "dataConsumed="+totalSize;

              console.log("Values "+" "+currPageSize+" "+totalSize);
              console.log("cookie "+getCookie('dataConsumed'));
              // chrome.storage?.session?.set({ usedData: totalSize });
            }
          );
        }
      );
  },[]);

  return (
    <div className="">
      <header className="App-header">
        {responseFromContent/1000 <100 ? <h3>Yay! Green website</h3> : <h3>Meh! Red website</h3>}
        <p>Current tab consumed {(responseFromContent/1000)} KB of data which is equivalent to {responseFromContent*0.000000011} g of emissions.</p>
        <p>Session emissions: {sessionStore*0.000000011} g</p>
        <p>Total data consumed in this session: {(sessionStore/1000)}KB</p>
      </header>
    </div>
  );
}
