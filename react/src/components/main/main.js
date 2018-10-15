import React, { Component } from 'react';
import Sidebar from './sidebar'
import Posts from './posts'

class Main extends Component {
    render() {
        return(
            <div className="main">
                <div className="grid-container">
                    {this.props.logged && <Sidebar logged={this.props.logged}/>}
                    <Posts logged={this.props.logged}/>
                </div>            
            </div>
         )
    }
}

export default Main;