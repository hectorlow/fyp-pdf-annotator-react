import React, { useState, useEffect } from 'react';
import './categoryModal.scss';

// TODO:
// Delete category, edit category, edit highlight

const CategoryModal = () => {
  const [categories, setCategories] = useState([]);
  const [displayAddCategory, setDisplayAddCategory] = useState(false);
  const [categoryIinput, setCategoryInput] = useState('');
  const [codeIinput, setCodeInput] = useState('');

  useEffect(() => {
    chrome.storage.sync.get(['fyp_categories'], (result) => {
      setCategories(result.fyp_categories);
      console.log(result.fyp_categories);
    });
  }, []);

  const handleCategory = (event) => {
    setCategoryInput(event.target.value);
  };

  const handleCode = (event) => {
    setCodeInput(event.target.value);
  };

  const handleSaveCategory = () => {
    // form validation rules
    if (categoryIinput.length === 0) {
      // eslint-disable-next-line no-alert
      alert('Category is empty');
      return;
    }
    const categoryNames = categories.map((category) => category.name);
    if (categoryNames.includes(categoryIinput)) {
      // eslint-disable-next-line no-alert
      alert('Category name already in use');
      return;
    }
    if (codeIinput.trim().length === 0) {
      // eslint-disable-next-line no-alert
      alert('Please enter at least 1 code');
      return;
    }

    const newCategoryEntry = {
      name: categoryIinput,
      codes: codeIinput.split('\n'),
    };
    categories.push(newCategoryEntry);
    chrome.storage.sync.set({ fyp_categories: categories }, () => {
      setCategories([...categories]);
      setCategoryInput('');
      setCodeInput('');
    });
  };

  const handleCancel = () => {
    setCategoryInput('');
    setCodeInput('');
    setDisplayAddCategory(false);
  };

  const newCategoryForm = () => (
    <form className="category-modal__add-new-form">
      <div className="category-modal__add-new-form__header">
        Add new category
      </div>
      <div>Category</div>
      <input
        className="category-modal__add-new-form__input"
        onChange={handleCategory}
        value={categoryIinput}
        type="text"
      />
      <div>Code (enter each code on a new line)</div>
      <textarea
        className="category-modal__add-new-form__input"
        rows="5"
        onChange={handleCode}
        value={codeIinput}
      />
      <div className="category-modal__add-new-form__buttons">
        <button
          onClick={handleSaveCategory}
          type="button"
        >
          Add new category
        </button>
        <button onClick={handleCancel} type="button">Cancel</button>
      </div>
    </form>
  );

  const deleteCategory = (name) => {
    const editedArray = categories.filter((category) => category.name !== name);
    chrome.storage.sync.set({ fyp_categories: editedArray }, () => {
      setCategories(editedArray);
    });
  };

  return (
    <div className="category-modal">
      <div className="category-modal__title">Category modal</div>
      <button
        onClick={() => setDisplayAddCategory(!displayAddCategory)}
        className="category-modal__add-new-btn"
        type="button"
      >
        Add new
      </button>
      {displayAddCategory && newCategoryForm()}

      <div className="category-modal__category-list-header">
        Categories (count:
        {' '}
        {categories.length}
        )
      </div>
      <div className="category-modal__category-list">
        {categories.map((category) => (
          <div className="category-modal__category-entry">
            <button
              className="category-modal__category-entry__del"
              type="button"
              onClick={() => deleteCategory(category.name)}
            >
              x
            </button>
            <div>{category.name}</div>
            <div>
              {category.codes.map((code) => (
                <div>{code}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryModal;
