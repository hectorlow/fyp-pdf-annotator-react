/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import rangy from 'rangy';
import 'rangy/lib/rangy-classapplier';
import 'rangy/lib/rangy-highlighter';
import 'rangy/lib/rangy-textrange';
import 'rangy/lib/rangy-serializer';
import AnnotationPopup from './components/AnnotationPopup';
import Sidebar from './components/Sidebar';
import './App.scss';

// initialise chrome storage
chrome.storage.sync.get(['fyp_highlights'], (result) => {
  if (
    result.fyp_highlights === undefined
      || !Array.isArray(result.fyp_highlights)
  ) {
    chrome.storage.sync.set({ fyp_highlights: [] }, () => {
      console.log('Initialise highlights to [] in chrome storage');
    });
  }
});

chrome.storage.sync.get(['fyp_categories'], (result) => {
  if (
    result.fyp_categories === undefined
    || !Array.isArray(result.fyp_categories)
  ) {
    chrome.storage.sync.set({ fyp_categories: [] }, () => {
      console.log('Initialised fyp categories to [] in chrome storage');
    });
  }
});

// const removeHighlights = () => {
//   rangyHighlighter.removeAllHighlights();
// };

const App = () => {
  const [selectedText, setSelectedText] = useState('');
  const [displayPopup, setDisplayPopup] = useState(false);
  const [coordinates, setCoordinates] = useState({ X: 0, Y: 0 });
  const [highlights, setHighlights] = useState([]);
  const [savedHighlightData, setSavedHighlightData] = useState({
    category: '',
    code: '',
    folder: '',
  });
  // alternate refreshHighlights value to trigger rerender
  const [rangyHighlighter, setRangyHighlighter] = useState({});
  const [triggerRerender, setTriggerRerender] = useState(true);

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
    // initialise rangy highlighter
    const highlighter = rangy.createHighlighter();
    // add class to rangy class applier
    highlighter.addClassApplier(
      rangy.createClassApplier('fyp-highlight--yellow', {
        elementProperties: {
          className: 'fyp-highlight',
        },
      }),
    );
    setRangyHighlighter(highlighter);

    chrome.storage.sync.get(['serialized_highlights'], (result) => {
      console.log(result.serialized_highlights);
      if (result.serialized_highlights !== undefined) {
        console.log('deserialize');
        highlighter.deserialize(
          decodeURIComponent(result.serialized_highlights),
        );
      }
    });
  }, []);

  useEffect(() => {
    document.body.onmouseup = selectSomething;
  });

  useEffect(() => {
    // chrome storage api works seemlessly, amazing
    chrome.storage.sync.get(['fyp_highlights'], (result) => {
      console.log('Saved highlights:', result.fyp_highlights);
      setHighlights(result.fyp_highlights);
    });
  }, [triggerRerender]);

  const existingHighlightOnclick = (event) => {
    const highlightId = event.target.getAttribute('fyphighlightid').toString();
    chrome.storage.sync.get(['fyp_highlights'], (result) => {
      const savedData = result.fyp_highlights.filter(
        (item) => (item.id === highlightId),
      )[0];
      setSavedHighlightData(savedData.options);
      setDisplayPopup(true);
    });
  };

  const highlightSelectedText = (highlightId) => {
    rangyHighlighter.highlightSelection('fyp-highlight--yellow');
    const nodes = rangy.getSelection().getRangeAt(0).getNodes(
      false,
      (el) => el.className && el.className.includes('fyp-highlight'),
    );

    nodes.forEach((node) => {
      // allow deletion of highlight
      // eslint-disable-next-line no-param-reassign
      node.onclick = existingHighlightOnclick;
      node.setAttribute('fyphighlightid', highlightId);
      node.setAttribute('id', highlightId);
    });
    rangy.getSelection().removeAllRanges();
  };

  // highlight CRUD functions
  const createHighlight = (color, options) => {
    const highlightId = uuidv4();
    const entry = {
      id: highlightId,
      color,
      text: window.getSelection().toString(),
      options,
    };
    chrome.storage.sync.get(['fyp_highlights'], (result) => {
      result.fyp_highlights.push(entry);
      chrome.storage.sync.set(
        { fyp_highlights: result.fyp_highlights }, () => {
          console.log('highlight saved: ', result.fyp_highlights);
          setTriggerRerender(!triggerRerender);
          setDisplayPopup(false);
          highlightSelectedText(highlightId);

          chrome.storage.sync.set(
            { serialized_highlights: rangyHighlighter.serialize() }, () => {
              console.log('saved serialized highlights');
            },
          );
        },
      );
    });
  };

  const deleteHighlight = (id) => {
    // do something with highlights
    const editedArray = highlights.filter((item) => item.id !== id);
    chrome.storage.sync.set({ fyp_highlights: editedArray }, () => {
      setTriggerRerender(!triggerRerender);
    });
  };

  return (
    <div>
      {displayPopup && (
        <AnnotationPopup
          coord={coordinates}
          createHighlight={createHighlight}
          existingData={savedHighlightData}
        />
      )}
      {/* <Sidebar highlights={highlights} deleteHighlight={deleteHighlight} /> */}
    </div>
  );
};

export default App;
