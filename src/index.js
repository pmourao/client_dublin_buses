import React from 'react';
import ReactDOM from 'react-dom';
import WebFontLoader from 'webfontloader';
import { Provider } from 'react-redux';
import './assets/scss/index.scss';
import Router from './Router';
import configureStore from './store/configure';

WebFontLoader.load({
  google: {
    families: ['Nunito Sans:300,400,600,700', 'Material Icons'],
  },
});

const store = configureStore();

const renderApp = () => (
  <Provider store={store}>
    <Router barButtonIconStyle={{ tintColor: 'white' }}/>
  </Provider>
);

ReactDOM.render(renderApp(), document.getElementById('root'));

