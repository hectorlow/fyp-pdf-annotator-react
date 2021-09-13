/* eslint-disable no-console */
// background script starts when extension is loaded

console.log('Background script running');

let annotateStatus = 'not set';

chrome.storage.local.get('annotate', (result) => {
  console.log('Annotate status: ', result.annotate);
  annotateStatus = result.annotate;
});

if (annotateStatus === undefined) {
  chrome.storage.local.set({ annotate: false }, () => {
    console.log('No initial status, set annotate status to false');
  });
}

// add listener to when user selects text - on mouse up listener
// do smth when text is selected

function getSelectionText() {
  let text = '';
  if (window.getSelection) {
    text = window.getSelection().toString();
  }
  console.log('hello world from selection text');
}

// document.body.onmouseup = getSelectionText;
console.log('body');

chrome.action.onClicked.addListener();

// chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//   chrome.tabs.sendMessage(tabs[0].id, { greeting: 'hello'}, (response) => {
//     console.log(response.farewell);
//   });
// });

// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {

//   }
// )

// const h2El = document.getElementById('locate_logs');
// h2El.addEventListener('click', () => {
//   alert('h2 element clicked');
// });
// console.log(h2El, 'h2 el');
