import React from 'react';
import './App.scss';

const App = () => {
  const openMainPage = () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('extensionPage.html') });
  };

  return (
    <div className="fyp-popup">
      <h2 className="fyp-popup__header">PDF Annotator</h2>
      <button
        onClick={() => openMainPage()}
        type="button"
      >
        Main page
      </button>
    </div>
  );
};

export default App;
