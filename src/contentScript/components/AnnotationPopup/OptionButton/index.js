import React from 'react';
import PropTypes from 'prop-types';
import './optionButton.scss';

const Option = ({ optionName, value, onClick }) => (
  <button
    className={`option-btn option-btn__${value}`}
    onClick={onClick}
    type="button"
  >
    {`${optionName}: ${value}`}
  </button>
);

Option.propTypes = {
  optionName: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Option;
