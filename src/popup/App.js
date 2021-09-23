import React, { useState, useEffect } from 'react';
import Category from './components/Category';
import './App.scss';

const dummyCategory = [
  {
    name: 'Lorem Ipsum',
    codes: ['Popularity', 'Origin'],
  },
  {
    name: 'Country',
    codes: ['Serbia', 'Sg'],
  },
  {
    name: 'Country',
    codes: ['Serbia', 'Sg'],
  },
  {
    name: 'Country',
    codes: ['Serbia', 'Sg'],
  },
  {
    name: 'Country',
    codes: ['Serbia', 'Sg'],
  },
];

const App = () => {
  const [displayCategory, setDisplayCategory] = useState(false);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    chrome.storage.sync.get(['fyp_categories'], (result) => {
      if (result.fyp_categories === undefined) {
        chrome.storage.sync.set({ fyp_categories: dummyCategory }, () => {
          console.log('Initialise fyp_categories to: []');
        });
        setCategoryData(dummyCategory);
      } else {
        // setCategoryData(result.fyp_categories);
        setCategoryData(dummyCategory);
      }
    });
  });

  return (
    <div className="fyp-popup">
      <h2 className="fyp-popup__header">PDF Annotator</h2>
      <button
        onClick={() => setDisplayCategory(!displayCategory)}
        type="button"
      >
        Categories
      </button>
      {displayCategory && <Category data={categoryData} />}
    </div>
  );
};

export default App;
