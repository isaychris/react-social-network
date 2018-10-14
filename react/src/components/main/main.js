import React, { Component } from 'react';
import Sidebar from './sidebar'
import Posts from './posts'

class Main extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="main">
                <div className="grid-container">
                    <Sidebar logged={this.props.logged}/>
                    <Posts logged={this.props.logged}/>
                </div>            
            </div>
         )
    }
}

export default Main;