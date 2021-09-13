/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import AnnotationPopup from './components/AnnotationPopup';

const App = () => {
  const [selectedText, setSelectedText] = useState('');
  const [displayPopup, setDisplayPopup] = useState(false);
  const [coordinates, setCoordinates] = useState({ X: 0, Y: 0 });

  const selectSomething = (event) => {
    console.log(event);
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
      console.log('same text selection');
    } else {
      setDisplayPopup(false);
    }
  };

  useEffect(() => {
    document.body.onmouseup = selectSomething;
  });

  return (
    <div>
      {displayPopup && <AnnotationPopup coord={coordinates} />}
    </div>
  );
};

export default App;
