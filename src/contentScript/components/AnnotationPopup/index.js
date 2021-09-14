import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ColorButton from './ColorButton';
import OptionButton from './OptionButton';
import SecondaryPopup from '../SecondaryPopup';
import './annotationPopup.scss';

// options, option -> belong to main annotation popup
// items, item -> belong to secondary popup
const colors = ['pink', 'orange', 'yellow', 'green', 'blue'];
const data = {
  code: ['Lorem ipsum', 'Lorem 2', 'Lorem 3'],
  category: ['popularity', 'origin'],
  folder: ['research', 'folder'],
};

const AnnotationPopup = ({ coord, createHighlight }) => {
  const [options, setOptions] = useState({
    category: 'Category',
    code: 'Code',
    folder: 'Folder',
  });
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedOption, setSelectedOption] = useState(false);
  const left = coord.X - 56;
  const top = coord.Y + 24;

  const handleItemSelection = (item) => {
    setOptions({
      ...options,
      [selectedOption]: `${selectedOption}: ${item}`,
    });
    setSelectedOption(false);
  };

  const handleCreateHightlight = () => {
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

  const renderOptions = () => (
    Object.keys(options).map((key) => (
      <OptionButton
        name={options[key]}
        selectedOption={selectedOption}
        onClick={() => setSelectedOption(key)}
      />
    ))
  );

  const renderSecondaryPopup = () => {
    const dataItems = data[selectedOption];
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
        {renderOptions()}
      </div>
      <button
        onClick={handleCreateHightlight}
        className="anno-create-highlight"
        type="button"
      >
        Create highlight
      </button>
      <div>
        {selectedOption && renderSecondaryPopup()}
      </div>
    </div>
  );
};

AnnotationPopup.propTypes = {
  coord: PropTypes.shape({
    X: PropTypes.number,
    Y: PropTypes.number,
  }).isRequired,
  createHighlight: PropTypes.func.isRequired,
};

export default AnnotationPopup;
