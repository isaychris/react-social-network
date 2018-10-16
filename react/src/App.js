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

import PrivateRoute from './components/auth/privateRoute'
import {app} from "./config/firebase_config"

import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logged: null,
      uid: null,
      authenticated: false,
      loading: true,
      selected: false,
    }
  }

  updateAuth = (bool) => {
    this.setState({authenticated: bool})
  }

  updateLogged = (user) => {
    this.setState({logged: user})
  }

  updateAuthLogged = (bool, user, uid) => {
    this.setState({
      authenticated: bool,
      logged: user,
      uid: uid
    })
  }
  updateSelected = () => {
    this.setState({selected: true})
  }

  componentWillMount = () => {
    app.auth().onAuthStateChanged(authUser => {
      if(authUser) {
        this.setState({
          logged: authUser.displayName,
          uid: authUser.uid,
          authenticated: true,
          loading: false
        }) 
      } else {
        this.setState({
          logged: null,
          authenticated: false,
          loading: false,
          uid: null
        }) 
      }
    })
  }

  render() {
    const {logged, authenticated, uid, loading} = this.state
    
    if(loading) {
      return null;
    }

    return(
      <BrowserRouter>
        <div className="App">
            <Navigation auth={this.authenticated} logged={logged} updateAuthLogged={this.updateAuthLogged}/>
            <Switch>
              <PrivateRoute exact path="/" component={Main} logged={logged} authenticated={authenticated}/>
              <PrivateRoute exact path="/upload" component={Upload} logged={logged} authenticated={authenticated}/>
              <Route path="/login" render={()=>
                (authenticated ? <Redirect to="/"/> : <Login updateAuthLogged={this.updateAuthLogged} />)} exact/>
              <Route path="/register" render={()=>
                (authenticated ? <Redirect to="/"/> : <Register logged={logged} updateLogged={this.updateLogged}/>)} exact/>
              <Route path="/select" render={()=><Select logged={logged} updateLogged={this.updateLogged}/>} exact/>
              
              <Route path="/u/:username" render={(props)=><Profile logged={logged} uid={uid} {...props} />} exact/>
              <Route path="/p/:id" render={(props)=><View logged={logged} {...props} />} exact/>
              <Route path="*" component={Error}/>
            </Switch>
        </div>
      </BrowserRouter>
    )
}
}

export default App;
