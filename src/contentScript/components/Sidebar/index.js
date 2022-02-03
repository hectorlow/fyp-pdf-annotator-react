import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CategoryModal from './CategoryModal';
import './sidebar.scss';

const Sidebar = ({ highlights, deleteHighlight }) => {
  console.log('highlights', highlights);
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
        <a href={`#${highlight.id}`} className="sidebar__highlight-entry">
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
        </a>
      ))}
    </div>
  );

  const exportHighlights = () => {
    // handle nested object
    // encode uri
    // download link
    // download file name

    const csvHeader = [
      'id',
      'color',
      'text',
      'category',
      'code',
      'folder',
      'title',
      'link',
    ];

    const rows = [
      csvHeader,
    ];

    highlights.forEach((entry) => {
      const values = [];
      values.push(entry.id);
      values.push(entry.color);
      values.push(entry.text.replace(/\n/, ' '));
      values.push(entry.options.category);
      values.push(entry.options.code);
      values.push(entry.folder);
      values.push(entry.title);

      rows.push(values);
    });

    const csvContent = `data:text/csv;charset=utf-8,${
      rows.map((e) => e.join(',')).join('\n')}`;

    const encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
  };

  return (
    <div className="sidebar">
      {displayCategories && (
        <CategoryModal />
      )}
      <div>Sidebar</div>
      <div>
        <button
          className="sidebar__buttons"
          onClick={() => setDisplayCategories(!displayCategories)}
          type="button"
        >
          Categories
        </button>
        <button
          className="sidebar__buttons"
          onClick={() => exportHighlights()}
          type="button"
        >
          Export highlights
        </button>
      </div>
      {renderHighlights()}
      <div id="abc">abc</div>
      <a href="#hello">Go to hello</a>
    </div>
  );
};

Sidebar.propTypes = {
  highlights: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
    }),
  ).isRequired,
  deleteHighlight: PropTypes.func,
};

Sidebar.defaultProps = {
  deleteHighlight: () => {
    // do nth
  },
};

export default Sidebar;
