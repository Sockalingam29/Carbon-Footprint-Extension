import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import { ChromeMessage, ChromeMessageResponse } from "./types";

import './App.css';

export default function App () {
  const [responseFromContent,setResponseFromContent] = React.useState(0);

  React.useEffect(() => {
    /**
     * We can't use "chrome.runtime.sendMessage" for sending messages from React.
     * For sending messages from React we need to specify which tab to send it to.
     */
    chrome.tabs && chrome.tabs.query({
      active: true,
      currentWindow: true
    }, tabs => {
      /**
       * Sends a single message to the content script(s) in the specified tab,
       * with an optional callback to run when a response is sent back.
       *
       * The runtime.onMessage event is fired in each content script running
       * in the specified tab for the current extension.
       */
      chrome.tabs.sendMessage(
        tabs[0].id || 0,
        { type: 'GET_DOM' } as ChromeMessage,
        (response: ChromeMessageResponse) => {
          console.log(response)
          setResponseFromContent(response.transferSize)
        });
    });
  });

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <p>Response from content:</p>
                <p>
                    {responseFromContent}
                </p>
            </header>
        </div>
    );
};
