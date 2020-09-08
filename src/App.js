import React, { Component } from 'react';
import './App.css';

import Layout from './components/Layout/Layout';
import Home from './containers/Home/Home';

class App extends Component {
  render () {
    return (
      <div className="App">
        <Layout>
          <Home />
        </Layout>
      </div>
    );
  }
}

export default App;
