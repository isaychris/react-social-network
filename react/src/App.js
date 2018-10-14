import React, { Component } from 'react';
import Navigation from './components/navigation'
import Profile from './components/profile/profile'
import Main from './components/main/main'
import Upload from './components/upload/upload'
import Login from './components/auth/login'
import Register from './components/auth/register'
import View from './components/view/view'
import Select from './components/auth/select'
import Error from './components/error'
import firebase from "./config/firebase_config"

import { BrowserRouter, Route, Switch, Redirect, Link } from 'react-router-dom'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logged: null,
      selected: false,
    }
  }

  updateLogged = (user) => {
    this.setState({logged: user})
  }

  updateSelected = () => {
    this.setState({selected: true})
  }

  componentWillMount = () => {
    firebase.auth().onAuthStateChanged(authUser => {
      if(authUser) {
        this.setState({
          logged: authUser.displayName,
          uid: authUser.uid
        }) 
      }
    })
  }
  
  render() {
    return(
      <BrowserRouter>
        <div className="App">
            <Navigation logged={this.state.logged} updateLogged={this.updateLogged}/>
            <Switch>
              <Route path="/" render={()=><Main logged={this.state.logged} />} exact/>
              <Route path="/upload" render={()=><Upload logged={this.state.logged} />} exact/>
              <Route path="/u/:username" component={Profile} exact/>
              <Route path="/p/:id" render={(props)=><View logged={this.state.logged} {...props} />} exact/>
              <Route path="/login" component={Login} exact/>
              <Route path="/register" component={Register} exact/>
              <Route path="/select" render={()=><Select logged={this.state.logged} updateLogged={this.updateLogged}/>} exact/>
              <Route path="*" component={Error}/>
            </Switch>
        </div>
      </BrowserRouter>
    )
  }
}

export default App;
