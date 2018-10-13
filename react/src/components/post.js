import React, { Component } from 'react';
import Comments from './comments'
import firebase from "../config/firebase_config"
import { Redirect, Link } from 'react-router-dom'

class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logged: props.logged,
            username: undefined,
            time: undefined,
            description: undefined,
            post_id: props.post_id,
            image: undefined,
            comments: [],
        }
    }

      updatePost = (snapshot) => {
        console.log(snapshot.val().time)
        this.setState({
          username: snapshot.val().username,
          description: snapshot.val().description,
          time: new Date(snapshot.val().time).toDateString(),
          image: snapshot.val().image
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();

        firebase.database().ref(`/comments`).child(this.state.post_id).push({
          username: this.state.logged,
          comment: this.input.value
      }).then((snap) => {
          console.log(snap)
          let new_comment = {username: this.state.logged, comment: this.input.value}
          this.setState({comments: [...this.state.comments, new_comment]})

          this.input.value = ""
      }).catch((error => {
          console.log(error)
      }))
    }

    componentDidMount = () => {
      firebase.database().ref(`/posts/${this.state.post_id}`).once('value', (snapshot) => {
          if(snapshot.val()) {
            this.updatePost(snapshot);
          } else {
              this.setState({redirect: true})
          }
      });

      let commentsref = firebase.database().ref(`/comments/${this.state.post_id}`);
      commentsref.once("value", (snapshot) => {
          if(snapshot.val()) {
            Object.entries(snapshot.val()).forEach(([key, val]) => {
              this.setState({comments: [...this.state.comments, val]})
          });
          } 
      });
    }

    render() {
      if(this.state.redirect) {
        return <Redirect to="/error"/>
      } else {
            return (
                <div className="post">
                <div className="card">
                <header className="card-header">
                  <div className="media">
                    <figure className="image is-48x48">
                      <img src="https://picsum.photos/200/?random" alt="Placeholder image"/>
                    </figure>
                    <p className="card-header-title content-username">
                      <Link to={`/u/${this.state.username}`}>{this.state.username}</Link>
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
                      <hr/>

                    <Comments data={this.state.comments}/>
    
                    <form onSubmit={this.handleSubmit}>
                      <div className="field has-addons">
                        <div className="control is-expanded">
                          <input ref={(input) => this.input = input} className="input" type="text" placeholder="Add a comment"/>
                        </div>
                        <div className="control">
                          <button className="button is-primary" type="submit">
                          Submit
                          </button>
                        </div>
                      </div>
                    </form>
    
                  </div>
                </div>
                </div>
                </div>
        );
        }
    }
}

export default Post;