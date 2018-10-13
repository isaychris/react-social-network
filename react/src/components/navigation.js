import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom'

const Navigation = (props) => {
    let profile_link = "/u/" + props.logged

    return (
        <nav className="navbar is-fixed-top" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
            <a className="navbar-item" href="/">
            <img src="https://bulma.io/images/bulma-logo.png" width="112" height="28"/>
            </a>

            <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            </a>
        </div>

        <div className="navbar-start" id="search-nav">
            <div className="navbar-item">
                <p className="control">
                    <input className="input" type="text" placeholder="Search"/>
                </p>
            </div>
        </div>

        <div className="navbar-end">
            <div className="navbar-item">
                <div className="buttons">
                    <Link to="/register" className="button is-primary">
                    <strong>Sign up</strong>
                    </Link>
                    <Link to="/login" className="button is-light">Log in</Link>

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
                            <Link to="/upload" className="dropdown-item">
                                Upload
                            </Link>

                            </div>
                        </div>
                        </div>

                </div>
            </div>
        </div>
        </nav>
    );
}

export default Navigation;