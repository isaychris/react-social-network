import React, { Component } from 'react';
import Post from './post'

class Main extends Component {
    render() {
        return(
            <div className="main">
                <Post/>
                <Post/>
                <Post/>
                <Post/>
                <Post/>
                <Post/>
            </div>
         )
    }
}

export default Main;