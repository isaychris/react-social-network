import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom'
import Updates from './updates'

class Sidebar extends Component {
    render() {
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
    }
}

export default Sidebar;