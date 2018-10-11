import React, { Component } from 'react';
import Comments from './comments'

class Post extends Component {
    constructor(props) {
        super(props);

        this.state = {
            liked: false,
            username: undefined,
            post_id: undefined,
        }
    }

    render() {
        return (
            <div className="Post">
            <div className="card">
            <header className="card-header">
              <div className="media">
                <figure className="image is-48x48">
                  <img src="https://picsum.photos/200/?random" alt="Placeholder image"/>
                </figure>
                <p className="card-header-title content-username">
                  username
                </p>
              </div>
            </header>
      
            <div className="card-image">
              <figure className="image is-4by3">
                <img src="https://picsum.photos/400/?random" alt="Placeholder image"/>
              </figure>
            </div>
            <div className="card-content">
              <div className="content">
                <div className="content-options"><button className="button is-danger is-outlined is-small">Like</button>
                  <time className="content-time">1 Jan 2018</time></div>
                <div className="content-body">Lorem ipsum dolor sit amet consectetur adipisicing elit. </div>
                <Comments/>
                <div className="field has-addons">
                  <div className="control is-expanded">
                    <input className="input" type="text" placeholder="Add a comment"/>
                  </div>
                  <div className="control">
                    <a className="button is-primary">
                    Submit
                    </a>
                  </div>
                </div>
              </div>
            </div>
            </div>
            </div>
        );
    }
}

export default Post;