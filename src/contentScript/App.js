/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
// try to only import what i need?
import { v4 as uuidv4 } from 'uuid';
import AnnotationPopup from './components/AnnotationPopup';

// chrome storage api works seemlessly, amazing
chrome.storage.sync.get(['fyp_highlights'], (result) => {
  console.log('Saved highlights:', result.fyp_highlights);
  if (
    result.fyp_highlights === undefined || !Array.isArray(result.fyp_highlights)
  ) {
    chrome.storage.sync.set({ fyp_highlights: [] }, () => {
      console.log('initialise chrome storage to: []');
    });
  }
});

const App = () => {
  const [selectedText, setSelectedText] = useState('');
  const [displayPopup, setDisplayPopup] = useState(false);
  const [coordinates, setCoordinates] = useState({ X: 0, Y: 0 });

  const selectSomething = (event) => {
    const textSelection = window.getSelection().toString();
    if (textSelection.length > 0 && textSelection !== selectedText) {
      setSelectedText(textSelection);
      setCoordinates({
        X: event.clientX,
        Y: event.clientY,
      });
      setDisplayPopup(true);
      console.log('selected text: ', textSelection);
    } else if (textSelection === selectedText) {
      // console.log('same text selection');
    } else {
      setDisplayPopup(false);
    }
  };

  useEffect(() => {
    document.body.onmouseup = selectSomething;
  });

  const createHighlight = (color, options) => {
    const id = uuidv4();
    const entry = {
      id,
      color,
      text: selectedText,
      options,
    };
    chrome.storage.sync.get(['fyp_highlights'], (result) => {
      result.fyp_highlights.push(entry);
      chrome.storage.sync.set(
        { fyp_highlights: result.fyp_highlights }, () => {
          console.log('highlight saved: ', result.fyp_highlights);
        },
      );
    });
  };

  return (
    <div>
      {displayPopup && (
        <AnnotationPopup
          coord={coordinates}
          createHighlight={createHighlight}
        />
      )}
    </div>
  );
};

export default App;
