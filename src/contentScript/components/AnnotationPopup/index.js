import React from 'react';
import ColorButton from './ColorButton';
import OptionButton from './OptionButton';
import './annotationPopup.scss';

const colors = ['pink', 'orange', 'yellow', 'green', 'blue'];
const options = ['Category', 'Code', 'Folder'];
const AnnotationPopup = () => {
  const renderColorBtns = () => (
    colors.map((color) => (
      <ColorButton color={color} />
    ))
  );

  const renderOptions = () => (
    options.map((option) => (
      <OptionButton name={option} />
    ))
  );

  return (
    <div className="anno-popup">
      <div className="anno-color-selection">
        {renderColorBtns()}
      </div>
      <div className="anno-options">
        {renderOptions()}
      </div>
    </div>
  );
};

export default AnnotationPopup;
