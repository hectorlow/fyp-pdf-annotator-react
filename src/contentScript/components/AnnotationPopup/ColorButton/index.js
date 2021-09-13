import React from 'react';
import PropTypes from 'prop-types';
import './colorButton.scss';

const ColorButton = ({ color }) => {
  console.log(color);
  return (
    <button type="button" className={`fyp-color-btn color-btn-${color}`} />
  );
};

ColorButton.propTypes = {
  color: PropTypes.string.isRequired,
};

export default ColorButton;
