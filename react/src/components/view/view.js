import React, { Component } from 'react';
import Post from '../post'

class View extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logged: props.logged,
            post_id: props.match.params.id,
        }
    }

    render() {
        return (
          <div className="view">
            <Post logged={this.state.logged} post_id={this.state.post_id}/>
          </div>
        )
    }
}

export default View;