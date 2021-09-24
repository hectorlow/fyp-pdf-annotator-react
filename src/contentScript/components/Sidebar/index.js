import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CategoryModal from './CategoryModal';
import './sidebar.scss';

const Sidebar = ({ highlights, deleteHighlight }) => {
  const [displayCategories, setDisplayCategories] = useState(false);
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

  const renderHighlights = () => (
    <div className="sidebar__highlight-entry-list">
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
  );

  return (
    <div className="sidebar">
      {displayCategories && (
        <CategoryModal />
      )}
      <div>Sidebar</div>
      <div>
        <button
          className="sidebar__categories"
          onClick={() => setDisplayCategories(!displayCategories)}
          type="button"
        >
          Categories
        </button>
      </div>
      {renderHighlights()}
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
