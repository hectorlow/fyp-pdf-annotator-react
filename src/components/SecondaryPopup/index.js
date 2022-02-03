import React from 'react';
import PropTypes from 'prop-types';
import './secondaryPopup.scss';

const SecondaryPopup = ({ items, handleSelection }) => (
  <div className="secondary-popup" style={{ left: 128, top: 28 }}>
    {items.map((item) => (
      <button
        className="secondary-popup__item"
        type="button"
        onClick={() => handleSelection(item)}
      >
        {item}
      </button>
    ))}
  </div>
);

SecondaryPopup.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleSelection: PropTypes.func.isRequired,
};

export default SecondaryPopup;
