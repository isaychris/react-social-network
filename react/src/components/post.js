import React, { Component } from 'react';
import Comments from './comments'
import {app} from "../config/firebase_config"
import { Redirect, Link } from 'react-router-dom'

class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: undefined,
            time: undefined,
            description: undefined,
            post_id: props.post_id,
            image: undefined,
            comments: [],
            liked: false,
        }
    }

    updatePost = (snapshot) => {
        this.setState({
          username: snapshot.val().username,
          description: snapshot.val().description,
          time: new Date(snapshot.val().time).toDateString(),
          image: snapshot.val().image
        })
    }

    handleLike = () => {
      if(!this.props.logged) {
        alert("You must be logged in to do that.")
        return
      }

      if(!this.state.liked) {
        app.database().ref(`/posts/${this.state.post_id}/liked`).push({
          username: this.props.logged
        }).then((snap) => {
            this.setState({liked: true})
        }).catch(error => {
            console.log(error)
        })
      } else {
        app.database().ref(`/posts/${this.state.post_id}/liked`).orderByChild('username').equalTo(this.props.logged).once("value", (snapshot) => {
          if(snapshot.val()) {
              snapshot.forEach((snap) => {
                  if(snap.val().username === this.state.username) {
                      snap.ref.remove()
                      this.setState({liked: false})
                      return
                  }
                })
              }
            })
          }
  }

    handleSubmit = (e) => {
        e.preventDefault();

        if(!this.props.logged) {
          alert("You must be logged in to do that.")
          return
        }
        
        app.database().ref(`/comments`).child(this.state.post_id).push({
          username: this.props.logged,
          comment: this.input.value
      }).then((snap) => {
          console.log(snap)
          let new_comment = {username: this.props.logged, comment: this.input.value}
          this.setState({comments: [...this.state.comments, new_comment]})

          this.input.value = ""
      }).catch((error => {
          console.log(error)
      }))
    }

    componentDidMount = () => {
      app.database().ref(`/posts/${this.state.post_id}`).once('value', (snapshot) => {
          if(snapshot.val()) {
            this.updatePost(snapshot);
          } else {
              this.setState({redirect: true})
          }
      });

      app.database().ref(`/posts/${this.state.post_id}/liked`).orderByChild('username').equalTo(this.props.logged).once("value", (snapshot) => {
        if(snapshot.val()) {
          this.setState({liked: true})
        } 
      });

      let commentsref = app.database().ref(`/comments/${this.state.post_id}`);
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
                <header>
                  <div className="media is-fullwidth">
                    <figure className="image is-48x48">
                      <img src="https://picsum.photos/200/?random" alt=""/>
                    </figure>
                    <p className="card-header-title content-username">
                      <Link to={`/u/${this.state.username}`}>{this.state.username}</Link>
                    </p>
                    <Link target="_blank" to={"/p/".concat(`${this.state.post_id}`)}><button className="button is-light is-small is-pulled-right share">Share</button></Link> 

                  </div>
                </header>
          
                <div className="card-image">
                  <figure className="image">
                    <img src={this.state.image} alt=""/>
                  </figure>
                </div>
                <div className="card-content">
                  <div className="content">
                    <div className="content-options">
                      {this.state.liked ? <button onClick={this.handleLike} className="button is-danger is-small">Unlike</button>
                      :
                      <button onClick={this.handleLike} className="button is-danger is-outlined is-small">Like</button>
                      }
                    <time className="content-time">{this.state.time}</time></div>
                    <div className="content-body">{this.state.description}</div>
                      <hr/>
                      {this.props.logged && <Comments data={this.state.comments}/>}

                    <form onSubmit={this.handleSubmit} style={{display: this.props.logged ? 'block' : 'none' }}>
                      <div className="field has-addons">
                        <div className="control is-expanded">
                          <input ref={(input) => this.input = input} className="input" type="text" placeholder="Add a comment" />
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