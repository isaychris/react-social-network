import React, { Component } from 'react';
import {app} from "./config/firebase_config"
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import Navigation from './components/navigation'
import Profile from './components/profile/profile'
import Main from './components/main/main'
import Upload from './components/upload/upload'
import Login from './components/auth/login'
import Register from './components/auth/register'
import View from './components/view/view'
import Error from './components/error'
import Settings from './components/settings/settings'
import PrivateRoute from './components/auth/privateRoute'
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
            test: undefined
        }
    }

    // Called immediately before mounting occurs, and before Component#render
    componentWillMount = () => {
        fetch('/test')
        .then(res => res.json())
        .then(test => console.log(test))
        .catch(() => console.log("Express backend not working"))

        // check if authentication changed
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


    // callback for updating auth
    updateAuth = (bool) => {
        this.setState({authenticated: bool})
    }


    // callback for updated logged user
    updateLogged = (user) => {
        this.setState({logged: user})
    }


    // callback for updating both auth and logged
    updateAuthLogged = (bool, user, uid) => {
        this.setState({
        authenticated: bool,
        logged: user,
        uid: uid
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
                    <PrivateRoute exact path="/settings" component={Settings} logged={logged} authenticated={authenticated}/>

                    <Route path="/login" render={()=>
                        (authenticated ? <Redirect to="/"/> : <Login updateAuthLogged={this.updateAuthLogged} />)} exact/>
                    <Route path="/register" render={()=>
                        (authenticated ? <Redirect to="/"/> : <Register logged={logged} updateLogged={this.updateLogged}/>)} exact/>
                    
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