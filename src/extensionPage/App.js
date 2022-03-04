import React from 'react';
import { Switch, Route } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import firebase from '../utils/firebase/app';
import MainPage from './mainPage/mainPage';
import './App.scss';

const App = () => {
  console.log('Extension running', window.location);
  return (
    <Switch>
      <Route path="/extensionPage.html" component={MainPage} />
      <Route path="/" exact component={MainPage} />
    </Switch>
  );
};

export default App;
