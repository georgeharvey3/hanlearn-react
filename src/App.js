import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import './App.css';
import { connect } from 'react-redux';

import Layout from './components/Layout/Layout';
import Home from './containers/Home/Home';
import AddWords from './containers/AddWords/AddWords';
import TestWords from './containers/TestWords/TestWords';
import Auth from './containers/Auth/Auth';
import Register from './containers/Auth/Register';
import Logout from './containers/Auth/Logout/Logout';
import SettingsPage from './containers/SettingsPage/SettingsPage';
import * as actions from './store/actions/index';

class App extends Component {
  constructor (props) {
    super(props);
    this.props.onTryAutoLogin();

    let speechTest;
    let synthTest;

    try {
        let speechTest = new window.webkitSpeechRecognition();
        if (speechTest !== null) {
            this.props.onSetSpeechAvailable(true);
        }
    } catch (err) {
        this.props.onSetSpeechAvailable(false);
    }

    try {
        let utterThis = new SpeechSynthesisUtterance("");
        if (utterThis !== null) {
            this.props.onSetSynthAvailable(true);
        }
    } catch (err) {
        this.props.onSetSynthAvailable(false);
    }
  }

  render () {
    return (
      <div className="App">
        <Layout>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/add-words" component={AddWords} />
            <Route path="/test-words" component={TestWords} />
            <Route path="/auth" component={Auth} />
            <Route path="/register" component={Register} />
            <Route path="/logout" component={Logout} />
            <Route path="/settings" component={SettingsPage} />
          </Switch>
        </Layout>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoLogin: () => dispatch(actions.authCheckState()),
    onSetSpeechAvailable: (available) => dispatch(actions.setSpeechAvailable(available)),
    onSetSynthAvailable: (available) => dispatch(actions.setSynthAvailable(available))

  }
}

export default withRouter(connect(null, mapDispatchToProps)(App));
