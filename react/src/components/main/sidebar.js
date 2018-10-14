import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom'
import Updates from './updates'

class Sidebar extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        if(this.props.logged) {
            return(
                <div className="sidebar">
                    <nav className="panel" styles="background-color: white;">
                        <p className="panel-heading">
                            Updates
                        </p>
                        <Updates/>
                    </nav>
                </div>
            )
        } else {
            return (null)
        }
    }
}

export default Sidebar;