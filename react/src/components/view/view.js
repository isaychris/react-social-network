import React, { Component } from 'react';
import Comments from '../comments'
import firebase from "../../config/firebase_config"
import { Redirect } from 'react-router-dom'

class View extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: undefined,
            time: undefined,
            description: undefined,
            post_id: props.match.params.id,
            image: undefined
        }
    }

    updateView = (snapshot) => {
        this.setState({
          username: snapshot.val().username,
          description: snapshot.val().description,
          time: snapshot.val().time,
          image: snapshot.val().image
        })
    }

    componentDidMount = () => {
      firebase.database().ref(`/posts/${this.state.post_id}`).once('value', (snapshot) => {
          if(snapshot.val()) {
            this.updateView(snapshot);
          } else {
              this.setState({redirect: true})
          }
      });
    }

    render() {
      if(this.state.redirect) {
        return <Redirect to="/error"/>
      } else {
        return (
            <div className="view">
            <div className="card">
            <header className="card-header">
              <div className="media">
                <figure className="image is-48x48">
                  <img src="https://picsum.photos/200/?random" alt="Placeholder image"/>
                </figure>
                <p className="card-header-title content-username">
                  {this.state.username}
                </p>
              </div>
            </header>
      
            <div className="card-image">
              <figure className="image">
                <img src={this.state.image}/>
              </figure>
            </div>
            <div className="card-content">
              <div className="content">
                <div className="content-options"><button className="button is-danger is-outlined is-small">Like</button>
                  <time className="content-time">{this.state.time}</time></div>
                <div className="content-body">{this.state.description}</div>
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
}

export default View;