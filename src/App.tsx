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

export default function App() {
  const [responseFromContent, setResponseFromContent] = React.useState(0);
  // const [sessionStore,setSessionStore]=React.useState(Number(localStorage.getItem('dataConsumed')) || 0 )
  if(!localStorage.getItem("dataConsumed")) localStorage.setItem("dataConsumed","0")
  const [sessionStore,setSessionStore]=React.useState(Number(localStorage.getItem("dataConsumed")) )
  // const [prevSessionStore,setPrevSessionStore]=React.useState(0)

  if(getCookie("cookie")=="") document.cookie = "cookie=0";
  const [temp,setTemp]=React.useState(Number(getCookie("cookie")))

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

              let currPageSize = response.transferSize
              setResponseFromContent(currPageSize);
              console.log("currPageSize "+currPageSize+" responseFromContent "+responseFromContent)

              // let totalSize = sessionStore
              // totalSize += currPageSize;
              
              if(localStorage.getItem(tabs[0].url||"") == null){
                document.cookie = "cookie="+(temp+currPageSize);
                localStorage.setItem(tabs[0].url||"",currPageSize.toString())
                localStorage.setItem("dataConsumed",(sessionStore+currPageSize).toString())
                setSessionStore(sessionStore+currPageSize);
                setTemp((prev)=>prev+currPageSize)
              }

              // setPrevSessionStore(currPageSize)


              console.log("Values "+" "+currPageSize);
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
        <p>Session consumption: {temp/1000} KB</p>
        <p>Total emissions: {sessionStore*0.000000011} g</p>
        <p>Total data consumed in this session: {(sessionStore/1000)}KB</p>
      </header>
    </div>
  );
}
