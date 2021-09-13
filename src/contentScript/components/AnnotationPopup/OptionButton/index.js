import React from 'react';
import PropTypes from 'prop-types';
import './optionButton.scss';

const Option = ({ name, onClick }) => (
  <button
    className={`option-btn option-btn__${name}`}
    onClick={onClick}
    type="button"
  >
    {name}
  </button>
);

Option.propTypes = {
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Option;
