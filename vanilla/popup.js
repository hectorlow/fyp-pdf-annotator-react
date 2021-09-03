console.log('popup script running');
const startAnnoButton = document.getElementById('startAnnotation');
const stopAnnoButton = document.getElementById('stopAnnotation');
const annoStatus = document.getElementById('annotationStatus')
const debugEl = document.getElementById('debug');

function setAnnotateStatus(status) {
  chrome.storage.local.set({ 'annotate': status }, () => {
    setDebugText(`annotate: ${status}`);
  })
}

function setDebugText(text) {
  debugEl.innerText = text;
}

chrome.storage.local.get(['annotate'], (result) => {
  if (result.annotate === true) {
    startAnno();
  }
})

function startAnno() {
  annoStatus.innerText = 'Annotating...';
  startAnnoButton.style.display = 'none';
  stopAnnoButton.style.display = 'block';
  // chrome.storage.local.set({ 'annotate': true }, () => {
  //   debugEl.innerText = 'annotate: true';
  // });
  setAnnotateStatus(true);
}

function stopAnno() {
  annoStatus.innerText = '';
  startAnnoButton.style.display = 'block';
  stopAnnoButton.style.display = 'none';
  // chrome.storage.local.set({ 'annotate': false }, () => {
  //   debugEl.innerText = 'annotate: false';
  // });
  setAnnotateStatus(false);
}

// debugEl.innerText = JSON.stringify(chrome.storage);
// console.log(chrome.storage, 'chrome.storage');

startAnnoButton.addEventListener('click', startAnno);

stopAnnoButton.addEventListener('click', stopAnno);