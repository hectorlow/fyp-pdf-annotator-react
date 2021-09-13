import React from 'react';
import PropTypes from 'prop-types';
import './optionButton.scss';

const Option = ({ name }) => (
  <button className={`btn btn-${name}`} type="button">{name}</button>
);

Option.propTypes = {
  name: PropTypes.string.isRequired,
};

export default Option;
