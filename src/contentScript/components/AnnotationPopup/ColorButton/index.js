import React from 'react';
import PropTypes from 'prop-types';
import tick from 'src/static/tick.png';
import './colorButton.scss';

const ColorButton = ({ color, selectedColor, onClick }) => (
  <button
    type="button"
    className={`fyp-color-btn color-btn-${color}`}
    onClick={onClick}
  >
    {(color === selectedColor)
      && <img className="color-btn-tick" src={tick} alt="" />}
  </button>
);

ColorButton.propTypes = {
  color: PropTypes.string.isRequired,
  selectedColor: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ColorButton;
