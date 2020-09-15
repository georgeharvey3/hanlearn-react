import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import './App.css';

import Layout from './components/Layout/Layout';
import Home from './containers/Home/Home';
import AddWords from './containers/AddWords/AddWords';
import TestWords from './containers/TestWords/TestWords';

class App extends Component {
  render () {
    return (
      <div className="App">
        <Layout>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/add-words" component={AddWords} />
            <Route path="/test-words" component={TestWords} />
          </Switch>
        </Layout>
      </div>
    );
  }
}

export default withRouter(App);
