import React from 'react';
import PropTypes from 'prop-types';
import './sidebar.scss';

const Sidebar = ({ highlights, deleteHighlight }) => {
  const renderOptions = (options) => {
    const arrayOptions = Object.keys(options);
    return (
      arrayOptions.map((key) => (
        <div>
          <span className="sidebar__highlight-entry--capitalise">{key}</span>
          {`: ${options[key]}`}
        </div>
      ))
    );
  };

  return (
    <div className="sidebar">
      <div>Sidebar</div>
      <div>
        {highlights.map((highlight) => (
          <div className="sidebar__highlight-entry">
            <button
              className="sidebar__highlight-entry__del"
              type="button"
              onClick={() => deleteHighlight(highlight.id)}
            >
              x
            </button>
            <div>
              Color:
              {' '}
              {highlight.color}
            </div>
            <div>
              Highlighted text:
              {' '}
              &quot;
              {highlight.text}
              &quot;
            </div>
            <div>
              {highlight.options && renderOptions(highlight.options)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  highlights: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
    }),
  ).isRequired,
  deleteHighlight: PropTypes.func.isRequired,
};

export default Sidebar;
