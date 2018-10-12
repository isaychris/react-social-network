import React, { Component } from 'react';
import Navigation from './components/navigation'
import Profile from './components/profile'
import Main from './components/main'
import Upload from './components/upload'
import Login from './components/login'
import Register from './components/register'

import { BrowserRouter, Route, Link } from 'react-router-dom'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    }
  }
  // componentDidMount() {
  //   fetch('/users')
  //     .then(res => res.json())
  //     .then(users => this.setState({ users }));
  // }

  render() {
    return (      
      <BrowserRouter>
        <div className="App">
            <Navigation/>
            <Route path="/" component={Main} exact/>
            <Route path="/profile" component={Profile} exact/>
            <Route path="/upload" component={Upload} exact/>
            <Route path="/login" component={Login} exact/>
            <Route path="/register" component={Register} exact/>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
