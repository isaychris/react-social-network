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

    handleUpdate = (user) => {
        this.props.updateLogged(user);
        this.setState({redirect: true})                     
    }

    updateProfile = (user) => {
        
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const user = this.user.value
        app.database().ref(`/profile/${user}`).once("value", (snapshot) => {
            if(snapshot.val()) {
                alert("Username already exists. Try Again.")
            } else {
                app.auth().createUserWithEmailAndPassword(this.email.value, this.pass.value).then((obj)=> {
                    app.database().ref('/profile').child(user).set({
                        uid: obj.user.uid,
                        description: "No description"
                    }).then(() => {
                        obj.user.updateProfile({
                            displayName: user
                        }).then(() => {
                            this.handleUpdate(user)
                        })
                    })

                    app.database().ref(`/profile/${user}/following`).push({
                        username: user
                    })
                    
                }).catch((error) => {
                    alert(error.message)
                })
            }
        })
    }

    render() {
        if(this.state.redirect) {
            return <Redirect to="/"/>
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
                            <input ref={(user) => this.user = user} className="input is-centered" type="text" placeholder="Username"></input>
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