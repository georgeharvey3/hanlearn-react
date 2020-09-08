import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';

import Layout from './components/Layout/Layout';
import Home from './containers/Home/Home';
import AddWords from './containers/AddWords/AddWords';

class App extends Component {
  render () {
    return (
      <div className="App">
        <Layout>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/add-words" component={AddWords} />
          </Switch>
        </Layout>
      </div>
    );
  }
}

export default App;
