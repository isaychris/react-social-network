import React, { Component } from 'react';
import { app } from "../../config/firebase_config"
import { Redirect } from 'react-router-dom'
import ContextUser from '../../contextUser'

// component for the login page
class Login extends Component {
    static contextType = ContextUser;

    constructor(props) {
        super(props);
        this.state = {
            redirect: false
        }
    }



    // handles login submission
    handleSubmit = (e) => {
        e.preventDefault();
        // sign in using fire base authentication service
        app.auth().signInWithEmailAndPassword(this.email.value, this.pass.value).then((obj)=> {
            // update auth states in root component
            this.context.actions.updateAuthLogged(true, obj.user.displayName, obj.user.uid)
        }).catch((error) => {
            alert(error.message)
        })
    }



    render() {
        if(this.state.redirect) {
            return <Redirect to="/"/>
        } else {
            return(
                <div className="login">
                    <div className="card">
                        <div className="card-header">
                            <p className="card-header-title is-centered">
                            Login
                            </p>
                        </div>
                        <div className="card-content">
                        <form onSubmit={this.handleSubmit}>
                            <input ref={(email) => this.email = email} className="input is-centered" type="email" placeholder="Email" autoComplete="username"></input>
                            <br/><br/>
                            <input ref={(pass) => this.pass = pass} className="input is-centered" type="password" placeholder="Password" autoComplete="current-password"></input>
                            <br/><br/>
                            <button type="submit" className="button is-primary is-fullwidth">Enter</button>
                        </form>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

Login.contextType = ContextUser;

export default Login;