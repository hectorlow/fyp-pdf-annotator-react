import React from 'react';
import './editCategory.scss';

const EditCategory = () => {
  const handleSave = () => {
    console.log('save');
  };

  return (
    <div className="edit-category">
      <div className="edit-category__category">
        <div className="edit-category__label">Category:</div>
        <input type="text" />
      </div>
      <div className="edit-category__codes">
        <div className="edit-category__label">Codes:</div>
        <textarea />
      </div>

      <button type="button">Save</button>
      <button type="button">Cancel</button>
    </div>
  );
};

export default EditCategory;
