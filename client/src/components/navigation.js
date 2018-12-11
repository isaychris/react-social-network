import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import {app} from "../config/firebase_config"
import ContextUser from '../contextUser'
import {withRouter} from 'react-router-dom'
import brand from '../brand.gif';

// functional component which serves as the navigation bar
class Navigation extends Component {
    static contextType = ContextUser;

    constructor(props) {
        super(props);

        this.state = {
            redirect: false,
        }
    }

    handleClick = () => {
        
        app.auth().signOut().then(() => {
            this.context.actions.updateAuthLogged(false, null, null)
        }, function(error) {
            alert('Sign Out Error', error);
        });
    }

    handleSubmit = (e) => {           
        e.preventDefault()
        if(this.input.value) {
            this.props.history.push(`/search/${this.input.value}`)
        }
    }

    // determines which buttons should be displayed based off weather or not user is logged in
    buttonsDisplay = (logged) => {
        let profile_link = "/u/" + this.context.state.logged

        // if not logged in, show sign up and login buttons
        if(!logged) {
            return (
                <div>
                    <Link to="/register" className="button is-primary"><strong>Sign up</strong></Link>
                    <Link to="/login" className="button is-light">Log in</Link>
                </div>
            )
        // if logged in, show upload, signout, and dropdown button which houses profile and settings link
        } else {
            return (
                <div>
                    <Link to="/upload" className="button is-primary">Upload</Link>
                    <Link to="/login" onClick={this.handleClick} className="button is-light">Sign out</Link>
                    <div className="dropdown is-hoverable is-right">
                        <div className="dropdown-trigger">
                            <button className="button" aria-haspopup="true" aria-controls="dropdown-menu3">
                            <span className="icon is-small">
                                <i className="fas fa-angle-down" aria-hidden="true"></i>
                            </span>
                            </button>
                        </div>
                        <div className="dropdown-menu" id="dropdown-menu3" role="menu">
                            <div className="dropdown-content">
                            <Link to={profile_link}  className="dropdown-item">
                                My Profile
                            </Link>
                            <Link to="/settings" className="dropdown-item">
                                Settings
                            </Link>

                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }
    render() {
        return(
            <nav className="navbar is-fixed-top" role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                    <Link to="/" className="navbar-item">
                    <img src={brand} alt="" width="90" height="30"/>
                    </Link>
                </div>

                <div className="navbar-start" id="search-nav">
                    <div className="navbar-item">
                        <form onSubmit={this.handleSubmit}>
                                <input ref={(input) => this.input = input} className="input" placeholder="Search" />
                        </form>
                    </div>
                </div>

                <div className="navbar-end">
                    <div className="navbar-item">
                        <div className="buttons">
                        { this.buttonsDisplay(this.context.state.logged) }
                        </div>
                    </div>
                </div>
                </nav>
            )
        }
    }

const WrappedNav = withRouter(Navigation)
WrappedNav.contextType = ContextUser;

export default WrappedNav;