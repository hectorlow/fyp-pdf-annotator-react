import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import rangy from 'rangy';
import 'rangy/lib/rangy-classapplier';
import 'rangy/lib/rangy-highlighter';
import 'rangy/lib/rangy-serializer';
import '../../../utils/highlightColors.scss';

import renderPDF from '../../../utils/renderPDF';
import './text_layer_builder.css';
import './renderedPdf.scss';

import Sidebar from '../../components/sidebar/sidebar';
import { exportCSV } from '../../../utils/helper';

const RenderedPdf = ({
  filepath, filename, scrollY, backToHome,
}) => {
  console.log('Render pdf file:', filepath, filename);

  if (filename === '') return '';

  // get filename of rendered pdf
  // const { filename } = location.state;
  const [rangyHighlighter, setRangyHighlighter] = useState(null);
  const [arrayH, setArrayH] = useState([]);

  const scrollPageBy = (pos) => {
    window.scroll(0, pos);
  };

  const initialiseRangy = () => {
    if (!rangy.initialized) {
      rangy.init();
    }

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
    return highlighter;
  };

  const getHighlightString = () => window.localStorage.getItem(filename);

  const getJSONHighlightArray = () => {
    const highlightArray = window.localStorage.getItem(`${filename}_array`);
    if (JSON.parse(highlightArray) === null) return [];

    return JSON.parse(highlightArray);
  };

  const retrieveLocalHighlights = () => [
    getHighlightString(),
    getJSONHighlightArray(),
  ];

  const getBaseCharOffset = (hl) => {
    // character offset of pdf file relative to whole page
    const canvases = document.getElementById('canvases');
    const sel = rangy.getSelection();
    const range = rangy.createRange();
    range.selectNode(canvases);
    sel.setSingleRange(range);

    hl.highlightSelection('fyp-highlight--yellow');

    const serialized = hl.serialize();
    const regex = new RegExp('[0-9]+');
    const baseOffset = regex.exec(serialized)[0];
    hl.unhighlightSelection();
    sel.removeAllRanges();

    return baseOffset;
  };

  const createHighlightString = (baseOffset, highlightArray) => {
    let str = 'type:textContent';
    if (highlightArray.length > 0) {
      highlightArray.sort((a, b) => a.start - b.start);
    }
    let count = 1;
    highlightArray.forEach((entry) => {
      str += '|';
      const intBaseOffset = parseInt(baseOffset, 10);
      const start = intBaseOffset + entry.start;
      const end = intBaseOffset + entry.end;
      str += `${start}$${end}$${count}$${entry.class}$`;
      count += 1;
    });

    return str;
  };

  const renderRetrievedHighlights = (highlighter, hlString, hlArray) => {
    if (hlArray) {
      setArrayH(hlArray);
    }

    if (hlString) {
      const str = createHighlightString(
        getBaseCharOffset(highlighter),
        hlArray,
      );
      highlighter.deserialize(str);
    }
  };

  useEffect(() => {
    if (scrollY > 0) {
      scrollPageBy(scrollY);
    }
  });

  useEffect(() => {
    const highlighter = initialiseRangy();

    const renderFinishCallback = () => {
      const [highlightString, highlightArray] = retrieveLocalHighlights();
      renderRetrievedHighlights(highlighter, highlightString, highlightArray);
    };

    renderPDF(filepath, filename, renderFinishCallback);
  }, []);

  // --------------------------------------------------------------------------
  // save current range/selection
  // get base
  // calculate offset
  // update string
  // highlight new selection
  const restoreHighlightSelection = (value) => {
    rangy.deserializeSelection(value);
  };

  const getCurrentHighlightRange = () => {
    rangyHighlighter.highlightSelection('fyp-highlight--yellow');
    // rangyHighlighter.highlightSelection('fyp-highlight--yellow');
    const serializedHighlight = rangyHighlighter.serialize();
    const regex1 = new RegExp('[0-9]+', 'g');
    const highlightRanges = serializedHighlight.match(regex1);

    return highlightRanges;
  };

  const createHighlightObj = (
    highlightRanges,
    baseOffset,
    selectionObj,
    yOffset,
  ) => {
    const curScrollOffset = window.scrollY || window.scrollTop
    || document.getElementsByTagName('html')[0].scrollTop;
    return {
      id: uuidv4(),
      start: highlightRanges[0] - baseOffset,
      end: highlightRanges[1] - baseOffset,
      class: 'fyp-highlight--yellow',
      text: selectionObj.toString(),
      code: 'not set yet',
      category: 'not set yet',
      absScroll: yOffset - 40 + curScrollOffset,
    };
  };

  const createH = () => {
    // save selection
    const selectionObj = rangy.getSelection();
    const firstNode = selectionObj.getRangeAt(0)
      .startContainer.parentElement;
    const yOffsetOfFirstNode = firstNode.getBoundingClientRect().y;
    const value = rangy.serializeSelection(selectionObj, true);
    rangyHighlighter.unhighlightSelection();

    const baseOffset = getBaseCharOffset(rangyHighlighter);

    restoreHighlightSelection(value);
    const highlightRanges = getCurrentHighlightRange();

    const newHighlight = createHighlightObj(
      highlightRanges,
      baseOffset,
      selectionObj,
      yOffsetOfFirstNode,
    );

    const highlights = getJSONHighlightArray();

    highlights.push(newHighlight);
    setArrayH([highlights]);

    // create updated highlight string
    let str = 'type:textContent';
    highlights.sort((a, b) => a.start - b.start);
    let count = 1;
    highlights.forEach((entry) => {
      str += '|';
      const intBaseOffset = parseInt(baseOffset, 10);
      const start = intBaseOffset + entry.start;
      const end = intBaseOffset + entry.end;
      str += `${start}$${end}$${count}$${entry.class}$`;
      count += 1;
    });

    // remove all highlights
    rangyHighlighter.removeAllHighlights();

    // deserailize updated string
    rangyHighlighter.deserialize(str);

    // save in local storage
    window.localStorage.setItem(filename, str);
    window.localStorage.setItem(
      `${filename}_array`, JSON.stringify(highlights),
    );
  };

  const loadHighlights = () => {
    const savedHighlights = window.localStorage.getItem(filename);
    if (savedHighlights) {
      rangyHighlighter.deserialize(savedHighlights);
    }
  };

  // refresh highlights
  const refreshPage = () => {
    // refresh highlights
    const updatedArray = JSON.parse(
      window.localStorage.getItem(`${filename}_array`),
    );
    setArrayH(updatedArray);

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
    rangyHighlighter.unhighlightSelection();
    sel.removeAllRanges();

    // create updated highlight string
    let str = 'type:textContent';
    if (updatedArray.length > 0) {
      updatedArray.sort((a, b) => a.start - b.start);
    }
    let count = 1;
    updatedArray.forEach((entry) => {
      str += '|';
      const intBaseOffset = parseInt(baseOffset, 10);
      const start = intBaseOffset + entry.start;
      const end = intBaseOffset + entry.end;
      str += `${start}$${end}$${count}$${entry.class}$`;
      count += 1;
    });

    // remove all highlights
    rangyHighlighter.removeAllHighlights();

    // deserailize updated string
    rangyHighlighter.deserialize(str);
  };

  const handleExport = () => {
    exportCSV([filename], filepath);
  };

  const handleResetLocalStorage = () => {
    window.localStorage.removeItem(filename);
    window.localStorage.removeItem(`${filename}_array`);

    window.location.reload(false);
  };

  return (
    <div className="display-pdf">
      <div className="display-pdf__top-bar">
        <button type="button" onClick={() => backToHome()}>Back</button>
        <span className="display-pdf__top-bar__filename">{filename}</span>
        <button type="button" onClick={createH}>
          Create highlight
        </button>

        <button type="button" onClick={handleExport}>
          Export
        </button>

        <button type="button" onClick={loadHighlights}>
          Load missing highlights
        </button>

        <button type="button" onClick={handleResetLocalStorage}>
          Clear all highlights
        </button>
      </div>

      <div className="display-pdf__body">
        <div className="display-pdf__body__canvas">
          <div id="canvases" />
        </div>
        <div className="display-pdf__body__sidebar">
          <Sidebar
            highlights={arrayH}
            filename={filename}
            refreshPage={refreshPage}
          />
        </div>
      </div>
    </div>
  );
};

RenderedPdf.propTypes = {
  filepath: PropTypes.string.isRequired,
  filename: PropTypes.string.isRequired,
  scrollY: PropTypes.number.isRequired,
  backToHome: PropTypes.func.isRequired,
};

export default RenderedPdf;
