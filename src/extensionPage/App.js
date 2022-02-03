import React from 'react';
import { Switch, Route } from 'react-router-dom';
import firebase from './firebase';
import RenderedPdf from './renderedPdf/renderedPdf';
import MainPage from './mainPage/mainPage';
import './App.scss';

const App = () => {
  console.log('app running', window.location);
  return (
    <Switch>
      <Route path="/" exact component={MainPage} />
      <Route path="/pdf" component={RenderedPdf} />
      <Route path="/extensionPage.html" component={MainPage} />
    </Switch>
  );
};

export default App;
