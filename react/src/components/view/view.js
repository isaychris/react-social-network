import React, { Component } from 'react';
import Post from '../post'

class View extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
          <div className="view">
            <Post logged={this.props.logged} post_id={this.props.match.params.id}/>
          </div>
        )
    }
}

export default View;