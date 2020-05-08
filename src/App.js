import React from 'react';
import { Redirect, Route, BrowserRouter as Router } from 'react-router-dom';

import './App.css';

import Chatbox from './components/Chatbox.js';
import Login from './components/Login.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { username: null };

    this.setUsername = this.setUsername.bind(this);
  }

  setUsername(username) {
    this.setState({ username: username });
  }

  render() {
    return (
      <div className="App">
        <Router>
          { this.state.username ? <Redirect to='/chat'/> : <Redirect to='/'/> }
          <Route exact path='/' render={ (props) => <Login  setUsername={ this.setUsername }/> }/>
          <Route path='/chat' render={ (props) => <Chatbox username={ this.state.username } /> }/>
        </Router>
      </div>
    );
  }
}

export default App;
