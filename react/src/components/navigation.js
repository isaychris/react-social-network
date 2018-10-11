import React, { Component } from 'react';

const Navigation = () => {
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

        <div className="navbar-end">
            <div className="navbar-item">
            <div className="buttons">
                <a className="button is-primary">
                <strong>Sign up</strong>
                </a>
                <a className="button is-light">Log in</a>
            </div>
            </div>
        </div>
        </nav>
    );
}

export default Navigation;