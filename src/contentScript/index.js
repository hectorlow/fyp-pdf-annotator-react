// file collects all js to be injected into pdf

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// eslint-disable-next-line no-console
console.log('react content script running');

const root = document.createElement('div');
root.innerHTML = "<div id='root'></div>";

document.body.appendChild(root);
ReactDOM.render(<App />, document.getElementById('root'));
