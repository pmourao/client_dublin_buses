import React, { Component } from 'react';
import { connect } from 'react-redux';
import { HashRouter, Switch, Route } from 'react-router-dom';
import HomePage from './pages/home';
import AboutPage from './pages/about';
import SwaggerPage from './pages/swagger';

class Router extends Component {
  componentDidMount() {
  }
  render() {
    return (
        <HashRouter>
          <Switch>
            <Route path="/" component={HomePage} exact />
            <Route path="/about" component={AboutPage} />
            <Route path="/swagger" component={SwaggerPage} />
            <Route component={HomePage} />
          </Switch>
        </HashRouter>
    );
  }
}

export default connect(null)(Router);
