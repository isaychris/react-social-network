import React, { Component } from 'react';
import {app} from "../../config/firebase_config"
import { Redirect } from 'react-router-dom'

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            registered: false,
            selected_username: false,
            redirect: false
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();

        app.auth().createUserWithEmailAndPassword(this.email.value, this.pass.value).then((obj)=> {
            this.setState({redirect: true})
        }).catch((error) => {
            alert(error.message)
        })
    }
    render() {
        if(this.state.redirect) {
            return <Redirect to="/select"/>
        } else {
            return(
                <div className="register">
                    <div className="card">
                        <div className="card-header">
                            <p className="card-header-title is-centered">
                            Register
                            </p>
                        </div>

                        <div className="card-content">
                        <form onSubmit={this.handleSubmit}>
                            <input ref={(email) => this.email = email} className="input is-centered" type="email" placeholder="Email"></input>
                            <br/><br/>
                            <input ref={(pass) => this.pass = pass} className="input is-centered" type="password" placeholder="Password"></input>
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

export default Register;