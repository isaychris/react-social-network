import React, { Component } from 'react';
import firebase from "../../config/firebase_config"
import { Redirect } from 'react-router-dom'

class Select extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false
        }
    }

    handleUpdate = (user) => {
        this.props.updateLogged(user);
        this.setState({redirect: true})                     
    }

    handleSubmit = (e) => {
        e.preventDefault();

        let accountsref = firebase.database().ref(`/accounts`);
        accountsref.orderByChild('username').equalTo(this.user.value).once("value", (snapshot) => {
            if(snapshot.val()) {
                alert("Username already exists. Try Again.")
            } else {
                firebase.auth().onAuthStateChanged(authUser => {
                    if(authUser) {
                        firebase.database().ref('/accounts').child(authUser.uid).set({
                            username: this.user.value
                        }).then(() => {
                            authUser.updateProfile({
                                displayName: this.user.value,
                            }).then(() => {
                                this.handleUpdate(this.user.value)
                            })
                        })
                    }
                })
            }
        });
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
                            Select a username
                            </p>
                        </div>

                        <div className="card-content">
                        <form onSubmit={this.handleSubmit}>
                            <input ref={(user) => this.user = user} className="input is-centered" type="text" placeholder="Username"></input>
                            <br/>
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

export default Select;