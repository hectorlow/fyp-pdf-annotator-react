import React from 'react';
import PropTypes from 'prop-types';
import './optionButton.scss';

const Option = ({
  label, value, onClick, disabled,
}) => (
  <button
    className={`option-btn option-btn__${value}`}
    onClick={onClick}
    type="button"
    disabled={disabled}
  >
    {`${label}: ${value}`}
  </button>
);

Option.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

Option.defaultProps = {
  disabled: false,
};

export default Option;
