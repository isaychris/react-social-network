import React, { Component } from 'react';
import Sidebar from './sidebar'
import Posts from './posts'

class Main extends Component {
    render() {
        return(
            <div className="main">
                <div className="grid-container">
                    <Sidebar/>
                    <Posts/>
                </div>            
            </div>
         )
    }
}

export default Main;