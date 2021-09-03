console.log('Extension content script running');
// priority -> creating a good enuf MVP

// TODO: add new category and code
// TODO: remove highlight on deselecting color
// TODO: generate unique id with uuid

// runtime urls for resources
const tickURL = chrome.runtime.getURL("tick.png");

// global variables
let previousSelection = '';
let selectedColor = null;
let selectedText = null;

const codes = ['Origin', 'Popularity'];
const categories = ['Lorem Ipsum', 'Lorem Ipsum 1', 'Lorem Ipsum 2'];
const folders = ['Lorem Research', 'Ipsum Research'];
const highlightColors = ['pink', 'orange', 'yellow', 'green', 'blue'];

const highlightTable = []
const exampleHighlight = {
  id: '1',
  color: 'red',
  category: 'fruits',
  code: 'apple',
  text: 'i like apples',
};
highlightTable.push(exampleHighlight);

// constants
const POPUPWIDTH = 128;

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// Annotation popup heirarchy
// - color buttons (pink, orange, yellow, green, blue)
// - category btn
// - code btn
// - folder btn
annotationPopup = document.createElement("div");
annotationPopup.innerHTML = `
  <div>
    <div class="color-selection">
      <button class="fyp-color-btn color-btn-pink" value="pink">
        <img class="tick" alt="" />
      </button>
      <button class="fyp-color-btn color-btn-orange" type="button" value="orange">
        <img class="tick" alt="" />
      </button>
      <button class="fyp-color-btn color-btn-yellow" type="button" value="yellow">
        <img class="tick" alt="" />
      </button>
      <button class="fyp-color-btn color-btn-green" type="button" value="green">
        <img class="tick" alt="" />
      </button>
      <button class="fyp-color-btn color-btn-blue" type="button" value="blue">
        <img class="tick" alt="" />
      </button>
    </div>
    <div class="category-code-folder">
      <button class="btn btn-category" type="button">Category</button>
      <button class="btn btn-code" type="button">Code</button>
      <button class="btn btn-folder" type="button">Folder</button>
    </div>
  </div>
`;
annotationPopup.setAttribute('id', 'popup');

// get individual button elements of annotation popup
const popupNode = annotationPopup.childNodes[1];
const colorSelectionNode = popupNode.childNodes[1];
const categoryCodeFolderNode = popupNode.childNodes[3]
const categoryBtn = categoryCodeFolderNode.childNodes[1];
const codeBtn = categoryCodeFolderNode.childNodes[3];
const folderBtn = categoryCodeFolderNode.childNodes[5];

// ------------------------------------------------------------------------------
// create category popup element
const categoryPopup = createSecondaryPopup(categories, 'category');
categoryPopup.setAttribute('class', 'secondary-popup category-popup');

categoryBtn.addEventListener('click', (event) => {
  displaySecondaryPopup(event, categoryPopup);
});

// ------------------------------------------------------------------------------
// create code popup element
const codePopup = createSecondaryPopup(codes, 'code');
codePopup.setAttribute('class', 'secondary-popup code-popup');

codeBtn.addEventListener('click', (event) => {
  displaySecondaryPopup(event, codePopup);
});

// ------------------------------------------------------------------------------
// create folder popup element
const folderPopup = createSecondaryPopup(folders, 'folder');
folderPopup.setAttribute('class', 'secondary-popup folder-popup');

folderBtn.addEventListener('click', (event) => {
  displaySecondaryPopup(event, folderPopup);
})

// ----------------------------------------------------------------------------
// Append popups to document body
const popups = [annotationPopup, categoryPopup, codePopup, folderPopup];
for (const popup of popups) {
  document.body.appendChild(popup);
}

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// Secondary popup functions

// create secondary popup function
function createSecondaryPopup(array, popupType) {
  newPopup = document.createElement('div');
  for (const text of array) {
    const element = document.createElement('btn');
    element.innerText = text;
    element.addEventListener('click', (event) => {
      handleSelectedOption(event, popupType);
    });
    element.setAttribute('class', 'secondary-btn');
    element.onmouseover = () => false;
    element.onselectstart = () => false;
    newPopup.appendChild(element);
  }
  const createNewButton = document.createElement('btn')
  createNewButton.innerText = `New ${popupType}`;
  createNewButton.setAttribute('class', 'secondary-btn');
  newPopup.appendChild(createNewButton);
  return newPopup;
}

function handleSelectedOption(event, popupType) {
  if (popupType === 'category') {
    categoryBtn.innerText = `Category: ${event.target.innerText}`;
  }

  if (popupType === 'code') {
    codeBtn.innerText = `Code: ${event.target.innerText}`;
  }

  if (popupType === 'folder') {
    folderBtn.innerText = `Folder: ${event.target.innerText}`;
  }
}

// show category popup function
function displaySecondaryPopup(event, popup) {
  popup.style.display = 'flex';
  popup.style.top = `${event.clientY}px`;
  popup.style.left = `${event.clientX}px`;
}
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

// show annotation popup function ---------------------------------------------
function isMainPopupShowing() {
  return annotationPopup.style.display === 'block';
};

function isColorBtnClicked(event) {
  return event.target.classList.contains('fyp-color-btn');
};

function isAlreadySelectedColorClicked(event) {
  return event.target.classList.contains('tick');
}

function isCodeCategoryFolderBtn(event) {
  return event.target.classList.contains('btn');
};

function isSecondaryPopupBtn(event) {
  return event.target.classList.contains('secondary-btn');
}

function highlightSelectedText(id, selectedText, color) {
  const selection = window.getSelection();
  const anchorNode = selection.anchorNode.parentNode;
  
  let innerHTML = anchorNode.innerHTML;
  const anchorOffset = innerHTML.indexOf(selectedText);
  const focusOffset = anchorOffset + selectedText.length;
  innerHTML = innerHTML.slice(0, anchorOffset)
    + `<span id='${id}' class='fyp-highlight fyp-highlight--${color}'>`
    + innerHTML.slice(anchorOffset, focusOffset)
    + "</span>"
    + innerHTML.slice(focusOffset);
  anchorNode.innerHTML = innerHTML;
  const highlight = document.getElementById(id);
  highlight.onclick = (event) => displayAnnoPopup(event, id);
}

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// need to consider all possible situations
// handle only display of popups?
function selectSomething(event) {
  selectedText = window.getSelection().toString();
  // console.log('selected text:', selectedText && selectedText.slice(0,10));
  // console.log('previous selection: ', previousSelection);

  if (selectedText) {
    // if selected text is new, display new popup
    if (selectedText !== previousSelection) {
      displayAnnoPopup(event);
      previousSelection = selectedText;
      return;
    }

    if (isColorBtnClicked(event)) {
      const id = generateRandomId();
      const color = event.target.value;
      highlightSelectedText(id, selectedText, color);
      tickHighlightedColor(event);
      createHighlightEntry(id, selectedText, color)


      // clear popups
      for (const popup of popups) {
        popup.style.display = 'none';
      }
      previousSelection = null;
      return;
    }
    return;
  }

  // clear all popups and set previous selection to null
  for (const popup of popups) {
    popup.style.display = 'none';
  }
  previousSelection = null;
}

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

// create annotation popup element --------------------------------------------
// TODO: hightable
// table of objects?

const createHighlightEntry = (id, text, color) => {
  const newEntry = {
    id,
    color,
    category: '',
    code: '',
    folder: '',
    text,
  }
  highlightTable.push(newEntry);
  console.log('highlight table: ', highlightTable);
}

// add on mouse up event listener function to document body -------------------
document.body.onmouseup = selectSomething;

// Handle selection of color for highlighted text -----------------------------
let colorButtons = document.getElementsByClassName('fyp-color-btn');
colorButtons = Array.from(colorButtons);

function tickHighlightedColor(event) {
  let colorButtons = document.getElementsByClassName('fyp-color-btn');
  colorButtons = Array.from(colorButtons);
  if (event.target.nodeName.toLowerCase() === 'button') {
    
    for (const colorBtn of colorButtons) {
      const img = colorBtn.childNodes[1]
      img.classList.remove('selected');
    }

    const img = event.target.childNodes[1];
    img.classList.add('selected');
    return;
  } 

  if (event.target.nodeName.toLowerCase() === 'img') {
    event.target.classList.remove('selected');
  }
}

// set src url of tick img element
const ticks = document.getElementsByClassName('tick');
for (const tick of ticks) {
  tick.src = tickURL;
}

// helper functions
function displayAnnoPopup(event, id=0) {
  const categoryCodeFolder = document.getElementsByClassName(
    'category-code-folder'
  )[0];

  const data = highlightTable.find(item => item.id === id);
  if (data) {
    categoryCodeFolder.style.display = 'block';
    console.log('data', data);
    const category = document.getElementsByClassName('btn-category')[0];
    const code = document.getElementsByClassName('btn-code')[0];
    const folder = document.getElementsByClassName('btn-folder')[0];
    category.innerText = 'Category' + `: ${data.category}`;
    code.innerText = 'Code' + `: ${data.code}`;
    folder.innerText = 'Folder' + `: ${data.folder}`;
  } else {
    categoryCodeFolder.style.display = 'none';
  }

  annotationPopup.style.display = 'block';
  annotationPopup.style.top = `${event.clientY + 24}px`;
  annotationPopup.style.left = `${event.clientX - POPUPWIDTH/2}px`;
}

function convertPixelToInt(pixel) {
  const lengthOfString = pixel.length;
  return parseInt(pixel.slice(0, length-2));
};

function printPopupPosition(event) {
  console.log(event.clientY, event.clientX);
};

function generateRandomId() {
  return Date.now().toString();
}


// TODO
// clean up previous workings
// - make highlight clickable
// - display popup agn on click (settings are saved)

// text is highlighted properly once user presses color btn
// highlighted text should be clickable
// *need to create unique id for each highlight
// - possible issues
// -- making highlight clickable
// -- highlighting text with html tags. E.g. <code>chrome.runtime</code>
// highlight is of the correct color

// side drawer with schema

// schema to store highlights
// store schema/table of highlights in localStorage
// export data from localStorage to csv
