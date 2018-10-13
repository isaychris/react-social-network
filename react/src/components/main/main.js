import React, { Component } from 'react';
import Sidebar from './sidebar'
import Posts from './posts'

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: this.props.logged,
        }
    }

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