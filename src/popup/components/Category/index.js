import React, { useState } from 'react';
import PropTypes from 'prop-types';
import EditCategory from './EditCategory';
import './category.scss';

const Category = ({ data }) => {
  const [edit, setEdit] = useState(false);

  const renderCategoryEntry = (entry) => (
    <button
      className="category-entry"
      onClick={() => setEdit(true)}
      type="button"
    >
      <div className="category-name">{entry.name}</div>
      <div>
        {entry.codes.map((code, index) => (
          <div className="category-code">
            {index + 1}
            .
            {' '}
            {code}
          </div>
        ))}
      </div>
    </button>
  );

  return (
    <div>
      <button className="category-add" type="button">Add</button>
      <div>Click category to edit</div>
      <section className="category-list">
        {data.map((item) => (
          renderCategoryEntry(item)
        ))}
      </section>
      <EditCategory />
    </div>
  );
};

Category.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    codes: PropTypes.arrayOf(PropTypes.string),
  })).isRequired,
};

export default Category;
