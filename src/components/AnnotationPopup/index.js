import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ColorButton from './ColorButton';
import OptionButton from './OptionButton';
import SecondaryPopup from '../SecondaryPopup';
import './annotationPopup.scss';

// options, option -> belong to main annotation popup
// items, item -> belong to secondary popup
const colors = ['pink', 'orange', 'yellow', 'green', 'blue'];
const dummyFolders = ['research', 'folder'];

const AnnotationPopup = ({ coord, createHighlight, existingData }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    existingData.category,
  );
  const [selectedCode, setSelectedCode] = useState(existingData.code);
  const [selectedFolder, setSelectedFolder] = useState(existingData.folder);
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [displaySecondaryPopup, setDisplaySecondaryPopup] = useState(false);
  const left = coord.X - 56;
  const top = coord.Y + 24;

  useEffect(() => {
    chrome.storage.sync.get(['fyp_categories'], (result) => {
      setCategories(result.fyp_categories);
      console.log('Saved categories', result.fyp_categories);
    });
  }, []);

  const handleItemSelection = (item) => {
    if (selectedOption === 'category') {
      setSelectedCategory(item);
      // clear code selection when new category is selected
      setSelectedCode('');
    } else if (selectedOption === 'code') {
      setSelectedCode(item);
    } else if (selectedOption === 'folder') {
      setSelectedFolder(item);
    }
    setDisplaySecondaryPopup(false);
  };

  const handleCreateHightlight = () => {
    const options = {
      category: selectedCategory,
      code: selectedCode,
      folder: selectedFolder,
    };
    if (selectedColor.length === 0) {
      createHighlight('yellow', options);
    } else {
      createHighlight(selectedColor, options);
    }
  };

  const renderColorBtns = () => (
    colors.map((color) => (
      <ColorButton
        color={color}
        selectedColor={selectedColor}
        onClick={() => setSelectedColor(color)}
      />
    ))
  );

  const renderSecondaryPopup = (option) => {
    let dataItems;
    if (option === 'category') {
      dataItems = categories.map((category) => category.name);
    } else if (option === 'code') {
      dataItems = categories.filter(
        (category) => category.name === selectedCategory,
      )[0].codes;
    } else if (option === 'folder') {
      dataItems = dummyFolders;
    }
    return (
      <SecondaryPopup
        items={dataItems}
        handleSelection={handleItemSelection}
      />
    );
  };

  return (
    <div className="anno-popup" style={{ left, top }}>
      <div className="anno-color-selection">
        {renderColorBtns()}
      </div>
      <div className="anno-options">
        {/* {renderOptions()} */}
        <OptionButton
          label="Category"
          value={selectedCategory}
          onClick={() => {
            setDisplaySecondaryPopup(true);
            setSelectedOption('category');
          }}
        />
        <OptionButton
          label="Code"
          value={selectedCode}
          onClick={() => {
            setDisplaySecondaryPopup(true);
            setSelectedOption('code');
          }}
          disabled={!selectedCategory}
        />
        <OptionButton
          label="Folder"
          value={selectedFolder}
          onClick={() => {
            setDisplaySecondaryPopup(true);
            setSelectedOption('folder');
          }}
        />
      </div>
      <button
        onClick={handleCreateHightlight}
        className="anno-create-highlight-btn"
        type="button"
      >
        Create highlight
      </button>
      <div>
        {displaySecondaryPopup && renderSecondaryPopup(selectedOption)}
      </div>
    </div>
  );
};

AnnotationPopup.propTypes = {
  coord: PropTypes.shape({
    X: PropTypes.number,
    Y: PropTypes.number,
  }),
  createHighlight: PropTypes.func,
  existingData: PropTypes.shape({
    category: PropTypes.string,
    code: PropTypes.string,
    folder: PropTypes.string,
  }),
};

AnnotationPopup.defaultProps = {
  coord: {
    X: 50,
    Y: 50,
  },
  createHighlight: () => {
    console.log('create highlight');
  },
  existingData: {
    category: '',
    code: '',
    folder: '',
  },
};

export default AnnotationPopup;
