// console.log('message');
// document.body.style.backgroundColor = 'red';
//
// const scriptElement = document.createElement('script');
// scriptElement.type = 'text/javascript';
// scriptElement.innerHTML = 'console.log("injected");';
// // script.src = chrome.runtime.getURL('inject.js');
// document.head.appendChild(scriptElement);

// chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
//   if (message.action === 'injectScript') {
//     document.body.style.backgroundColor = 'green';
//   }
// });

// const script = document.createElement('script');
// script.type = 'text/javascript';
// script.innerHTML = `
//       console.log('Injected script');
//       // Your custom JavaScript code here
//     `;


// <meta http-equiv="Content-Security-Policy"
//       content="default-src * 'unsafe-inline'; script-src * 'unsafe-inline'; connect-src * 'unsafe-inline'; img-src * data: blob: 'unsafe-inline'; frame-src ; style-src 'unsafe-inline';"/>

eval('console.log("message")');

// document.head.appendChild(script);
