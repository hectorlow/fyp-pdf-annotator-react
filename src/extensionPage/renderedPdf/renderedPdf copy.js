import React, { useState, useEffect } from 'react';
import PropTypes, { array } from 'prop-types';
import { useHistory } from 'react-router-dom';

import rangy from 'rangy';
import 'rangy/lib/rangy-classapplier';
import 'rangy/lib/rangy-highlighter';
import 'rangy/lib/rangy-serializer';
import 'rangy/lib/rangy-textrange';
import '../../utils/highlightColors.scss';

import renderPDF from '../../utils/renderPDF';
import AnnotationPopup from '../../components/AnnotationPopup';
import '../text_layer_builder.css';
import './renderedPdf.scss';

const RenderedPdf = ({ location }) => {
  const history = useHistory();

  // get filename of rendered pdf
  const { filename } = location.state;
  const [rangyHighlighter, setRangyHighlighter] = useState(null);
  const [displayPopup, setDisplayPopup] = useState(false);
  const [arrayH, setArrayH] = useState([]);
  const [newStr, setNewStr] = useState('');

  useEffect(() => {
    // initialise rangy highligher
    const canvases = document.getElementById('canvases');
    const highlighter = rangy.createHighlighter();
    highlighter.addClassApplier(
      rangy.createClassApplier('fyp-highlight--yellow', {
        elementProperties: {
          className: 'fyp-highlight',
        },
      }),
    );

    // set state for rangy highlighter
    setRangyHighlighter(highlighter);

    // render pages of pdf
    renderPDF(filename);
  }, []);

  const handleGoBack = () => {
    history.goBack();
  };

  const getSavedHighlightsAndCount = (name) => {
    const savedHighlights = window.localStorage.getItem(name);
    const savedCounts = window.localStorage.getItem(`${name}_count`);
    return [savedHighlights, JSON.parse(savedCounts)];
  };

  const setHighlightsAndCount = (name, serialized, countHashmap) => {
    window.localStorage.setItem(name, serialized);
    window.localStorage.setItem(
      `${name}_count`,
      JSON.stringify(countHashmap),
    );
  };

  const getNumHighlightedNodes = () => {
    const node = rangy.getSelection(rangy.getSelection());
    const numNodes = node.getRangeAt(0).getNodes(
      false,
      (el) => el.className && el.className.includes('fyp-highlight'),
    ).length;

    return numNodes;
  };

  const getIndividualSerializedString = (string1, string2) => {
    // function assumes string1 is a subset of string 2
    const map = new Map();
    let str = '';

    if (string1 !== null) {
      const array = string1.split('|');
      for (let i = 1; i < array.length; i += 1) {
        map[array[i]] = 1;
      }
    }

    const newString = string2.split('|');
    for (let i = 1; i < newString.length; i += 1) {
      if (map[newString[i]] === undefined) {
        str = newString[i];
        break;
      }
    }
    return str;
  };

  const addUniqueClassName = (serializedString, map) => {
    console.log(serializedString);
    const highlightIds = serializedString.split('|');
    highlightIds.splice(0, 1);

    let p1 = 0;
    const highlightElements = document.getElementsByClassName('fyp-highlight');
    for (let i = 0; i < highlightElements.length; i += 1) {
      let inLoop = false;
      const count1 = map[highlightIds[p1]];
      for (let j = 0; j < count1; j += 1) {
        highlightElements[i].classList.add(highlightIds[p1]);
        i += 1;
        inLoop = true;
      }
      if (inLoop) i -= 1;
      p1 += 1;
    }
  };

  const handleCreateHighlight = () => {
    console.log('Text highlighted');
    // create highlight with rangy
    rangyHighlighter.highlightSelection('fyp-highlight--yellow');

    // update serialized string
    const serialized = rangyHighlighter.serialize();

    // get number of nodes highlighted
    const numNodes = getNumHighlightedNodes();

    // find serialized string for newly created highlight
    const [savedHighlights, savedCounts] = getSavedHighlightsAndCount(filename);
    const str = getIndividualSerializedString(savedHighlights, serialized);
    const countHashmap = {
      ...savedCounts,
    };
    countHashmap[str] = numNodes;

    // save serialized string and count dictionary in local storage
    setHighlightsAndCount(filename, serialized, countHashmap);

    // update ids of highlight elements
    addUniqueClassName(serialized, countHashmap);
  };

  const handleLoadHighlights = () => {
    const [savedHighlights, savedCounts] = getSavedHighlightsAndCount(filename);
    if (savedHighlights) {
      rangyHighlighter.deserialize(savedHighlights);
      addUniqueClassName(savedHighlights, savedCounts);
    } else {
      console.log('no saved highlights');
    }
  };

  const handleRemoveHighlight = () => {
    rangyHighlighter.unhighlightSelection();
    const serialized = rangyHighlighter.serialize();

    const [savedHighlights, savedCounts] = getSavedHighlightsAndCount(filename);
    const removedString = getIndividualSerializedString(
      serialized,
      savedHighlights,
    );

    delete savedCounts[removedString];
    setHighlightsAndCount(filename, serialized, savedCounts);
  };

  const handleAll = () => {
    const canvases = document.getElementById('canvases');
    const sel = rangy.getSelection();
    const range = rangy.createRange();
    range.selectNode(canvases);
    console.log(range);
    sel.setSingleRange(range);
    rangyHighlighter.highlightSelection('fyp-highlight--yellow');
    const serialized = rangyHighlighter.serialize();
    console.log('serialized', serialized);
    rangyHighlighter.unhighlightSelection();
    sel.removeAllRanges();
  };

  const addElement = () => {
    const bar = document.getElementsByClassName('display-pdf__top-bar')[0];
    const extra = document.createElement('button');
    extra.innerText = 'button';
    bar.appendChild(extra);
  };

  const highlightsS = () => {
    // console.log(rangy.Selection(), 'rangy highlights');
    console.log(rangy.getSelection().getAllRanges(), 'all ranges');
  };

  // --------------------------------------------------------------------------
  // save current range/selection
  // get base
  // calculate offset
  // update string
  // highlight new selection

  const createH = () => {
    // save selection
    const selectionObj = rangy.getSelection();
    const value = rangy.serializeSelection(selectionObj, true);
    rangyHighlighter.unhighlightSelection();

    // get base offset
    const canvases = document.getElementById('canvases');
    const sel = rangy.getSelection();
    const range = rangy.createRange();
    range.selectNode(canvases);
    sel.setSingleRange(range);
    rangyHighlighter.highlightSelection('fyp-highlight--yellow');
    const serialized = rangyHighlighter.serialize();
    const regex = new RegExp('[0-9]+');
    const baseOffset = regex.exec(serialized)[0];
    console.log(baseOffset);
    rangyHighlighter.unhighlightSelection();
    sel.removeAllRanges();

    // restore highlight selection
    rangy.deserializeSelection(value);

    // get highlight range
    rangyHighlighter.highlightSelection('fyp-highlight--yellow');
    const serializedHighlight = rangyHighlighter.serialize();
    console.log(serializedHighlight);
    const regex1 = new RegExp('[0-9]+', 'g');
    const highlightRanges = serializedHighlight.match(regex1);
    console.log(highlightRanges[0], highlightRanges[1]);

    // create highlight string with new offset
    const newHighlight = {
      start: highlightRanges[0] - baseOffset,
      end: highlightRanges[1] - baseOffset,
      class: 'fyp-highlight--yellow',
    };

    arrayH.push(newHighlight);
    console.log(arrayH);
    setArrayH([...arrayH]);

    // create updated highlight string
    let str = 'type:textContent';
    if (arrayH.length > 0) {
      arrayH.sort((a, b) => a.start - b.start);
    }
    let count = 1;
    arrayH.forEach((entry) => {
      str += '|';
      const intBaseOffset = parseInt(baseOffset, 10);
      const start = intBaseOffset + entry.start;
      const end = intBaseOffset + entry.end;
      str += `${start}$${end}$${count}$${entry.class}$`;
      count += 1;
    });
    console.log('new str:', str);

    // remove all highlights
    rangyHighlighter.removeAllHighlights();

    setNewStr(str);
    // deserailize updated string
    rangyHighlighter.deserialize(str);
  };

  const createHighlight = () => {
    rangyHighlighter.highlightSelection('fyp-highlight--yellow');
    const serialized = rangyHighlighter.serialize();
    console.log(serialized);
  };

  const deserialize = () => {
    console.log(rangyHighlighter.highlights);
    rangyHighlighter.deserialize(
      // newStr,
      // 'type:textContent|2961$2968$1$fyp-highlight--yellow$'
      'type:textContent|2961$2968$1$fyp-highlight--yellow$',
    );
  };

  return (
    <div className="display-pdf">
      {displayPopup && <AnnotationPopup />}
      <div className="display-pdf__top-bar">
        <button type="button" onClick={handleGoBack}>Go back</button>
        <span className="display-pdf__top-bar__filename">{filename}</span>
        {/* <button type="button" onClick={handleCreateHighlight}>
          Create highlight
        </button>
        <button type="button" onClick={handleLoadHighlights}>
          Load highlights
        </button>
        <button type="button" onClick={handleRemoveHighlight}>
          Remove highlight
        </button>
        <button type="button" onClick={handleAll}>
          Highlight everything
        </button>
        <button type="button" onClick={addElement}>
          Add element
        </button>
        <button type="button" onClick={highlightsS}>
          Rangy selection
        </button> */}
        <button type="button" onClick={createH}>
          Get selection
        </button>
        <button type="button" onClick={createHighlight}>
          Simple highlight
        </button>
        <button type="button" onClick={deserialize}>
          Deserialize sample string
        </button>
      </div>
      <div className="display-pdf__body">
        <div id="canvases" />
      </div>
    </div>
  );
};

RenderedPdf.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      filename: PropTypes.string,
    }),
  }).isRequired,
};

export default RenderedPdf;
