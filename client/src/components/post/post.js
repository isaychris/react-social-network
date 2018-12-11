import React, { Component } from 'react';
import {app } from "../../config/firebase_config"
import { Redirect, Link } from 'react-router-dom'
import Comments from './comments'
import ContextUser from '../../contextUser'
import Tags from './tags'

// component to display a photo post
class Post extends Component {
    static contextType = ContextUser;

    constructor(props) {
        super(props);

        this.state = {
            username: undefined,
            profile_pic: undefined,
            time: undefined,
            description: undefined,
            edit: false,
            post_id: props.post_id,
            image: undefined,
            tags: [],
            comments: [],
            likes_num: 0,
            liked: false,
            render: true,
        }
    }


    // Called immediately after a component is mounted. Setting state here will trigger re-rendering.
    componentDidMount = () => {
        // retrieve post data for post id
        app.database().ref(`/posts/${this.state.post_id}`).once('value', (snapshot) => {
            // if it exists, update states for post
            if(snapshot.val()) {
                this.updatePost(snapshot);
            // if not redirect to error page
            } else {
                this.props.updateRedirect(true, "error")
            }
        }).then(() => {
            app.database().ref(`/profile/${this.state.username}`).once("value", (snapshot) => {
                if(snapshot.val()) {
                    if(snapshot.val().picture) {
                        this.setState({profile_pic: snapshot.val().picture})
                    } else {
                        this.setState({profile_pic: "https://firebasestorage.googleapis.com/v0/b/react-social-network-7e88b.appspot.com/o/assets%2Fdefault.png?alt=media"})
                    }
                }
            })
    })

        // check if logged user had liked the image
        app.database().ref(`/posts/${this.state.post_id}/liked`).orderByChild('username').equalTo(this.context.state.logged).once("value", (snapshot) => {
            // if they did, set liked state to true, which will toggle the like button
            if(snapshot.val()) {
            this.setState({liked: true})
            } 
        });

        // retrieve the comments for the post
        let commentsref = app.database().ref(`/comments/${this.state.post_id}`);
        commentsref.once("value", (snapshot) => {
            if(snapshot.val()) {
                Object.entries(snapshot.val()).forEach(([key, val]) => {
                    this.setState({comments: [...this.state.comments, val]})
                });
            } 
        });

        // retrieve tags for the post
        app.database().ref(`/posts/${this.state.post_id}/tags`).once('value', (snapshot) => {
            if(snapshot.val()) {
                Object.entries(snapshot.val()).forEach(([key, val]) => {
                    this.setState({tags: [...this.state.tags, val]})
                });
            } 
        });
    }



    // updates post states from database if it exists
    updatePost = (snapshot) => {
        this.setState({
            username: snapshot.val().username,
            description: snapshot.val().description,
            time: new Date(snapshot.val().time).toDateString(),
            image: snapshot.val().image,
            likes_num: snapshot.val().like_num
        })
    }



    // handles click event for like/unlike button
    handleLike = () => {

        // only authenticated useres can like a photo
        if(!this.context.state.logged) {
            alert("You must be logged in to do that.")
            return
        }

      // if button click, and state is not initailly liked,
        if(!this.state.liked) {
            let likeref = app.database().ref(`/posts/${this.state.post_id}/liked`)
        
            // like the post by setting a like variable with the logged users name as value in database.
            likeref.push({
            username: this.context.state.logged
        }).then((snap) => {
            // increment the posts like num
            app.database().ref(`/posts/${this.state.post_id}/like_num`).transaction((like) => {
                return like + 1;
            });

            // set the posts like state to true
            this.setState({liked: true, likes_num: this.state.likes_num + 1})
            // add a reference to the liked image to the logged users profile account
            app.database().ref(`/profile/${this.context.state.logged}/liked`).push({post: this.state.post_id})
        }).catch(error => {
            console.log(error)
        })

        // if button click, and state is  initailly liked
        } else {
            app.database().ref(`/posts/${this.state.post_id}/liked`).orderByChild('username').equalTo(this.context.state.logged).once("value", (snapshot) => {
                if(snapshot.val()) {
                    snapshot.forEach((snap) => {
                        if(snap.val().username === this.state.username) {
                            snap.ref.remove()
                            app.database().ref(`/posts/${this.state.post_id}/like_num`).transaction((like) => {
                                return like - 1;
                            });
                            this.setState({liked: false, likes_num: this.state.likes_num - 1})

                            app.database().ref(`/profile/${this.context.state.logged}/liked`).orderByChild('post').equalTo(this.state.post_id).once("value", (snapshot) => {
                                if(snapshot.val()) {
                                    snapshot.forEach((snap) => {
                                        if(snap.val().post == this.state.post_id) {
                                            snap.ref.remove()
                                            return
                                        }
                                    })
                                }
                            })
                            return
                        }
                    })
                }
            })
        }
    }



    // handles the deletion of a post
    handleDelete = () => {
        let input = window.confirm("Are you sure you want to delete this photo?")

        if(input) {
            app.database().ref(`/posts`).child(this.state.post_id).remove().then(() => {
            alert("Photo deleted!")
            this.setState({render: false})
            })
        }

        if(this.props.updateRedirect) {
            this.props.updateRedirect(true, "profile")
        }
    }



    // handles the edit save of a post
    handleSave = () => {
        app.database().ref(`/posts/${this.state.post_id}/description`).set(this.state.description).then(() => {
            this.setState({edit: false})
            alert("saved")
        }).catch((error) => {
            alert(error)
        })
    }



    // handle the click event on edit button
    handleEdit = () => {
        this.setState({edit: true})
    }



    // handles whatever description change
    handleEditChange = (e) => {
        this.setState({description: e.target.value})
    }



    // handles the submssion of a comment
    handleSubmit = (e) => {
        e.preventDefault();

        if(!this.context.state.logged) {
            alert("You must be logged in to do that.")
            return
        }
        
        app.database().ref(`/comments`).child(this.state.post_id).push({
            username: this.context.state.logged,
            comment: this.input.value
        }).then((snap) => {
            let new_comment = {username: this.context.state.logged, comment: this.input.value}
            this.setState({comments: [...this.state.comments, new_comment]})

            this.input.value = ""
        }).catch(error => {
            console.log(error)
        })
    }



    // determines noun form of likes
    displayLikesNum = () => {
      if(this.state.likes_num == 1) {
        return <span className="likes-num">{this.state.likes_num} <label>like</label></span>
      } else {
        return <span className="likes-num">{this.state.likes_num} <label>likes</label></span>
      }
    }



    // determines weather or not to display the edit/delete dropdown.
    displayPhotosDropdown = () => {
      // display only if the user owns the image
      if(this.state.username == this.context.state.logged) {
        return (   
          <div className="dropdown is-hoverable is-right is-small photo-dropdown">
          <div className="dropdown-trigger">
              <button className="button" aria-haspopup="true" aria-controls="dropdown-menu3">
              <span className="icon is-small" style={{height: 0 + "px"}}>
                  <i className="fas fa-angle-down" aria-hidden="true"></i>
              </span>
              </button>
          </div>
          <div className="dropdown-menu" id="dropdown-menu3" role="menu">
              <div className="dropdown-content">
              <a onClick={this.handleEdit} className="dropdown-item">
                  Edit
              </a>
              <a onClick={this.handleDelete} className="dropdown-item">
                  Delete
              </a>

              </div>
          </div>
      </div>
        )
      } else {
        return null
      }
    }



    render() {
      if(this.state.redirect) {
        return <Redirect to="/error"/>
      } else {
        if(this.state.render) {
            return (
                <div className="post">
                <div className="card">
                <header>
                  <div className="media is-fullwidth">
                    <figure className="image is-48x48">
                      <img src={this.state.profile_pic} alt=""/>
                    </figure>
                    <p className="card-header-title content-username">
                      <Link to={`/u/${this.state.username}`}>{this.state.username}</Link>
                    </p>
                    <Link target="_blank" to={"/p/".concat(`${this.state.post_id}`)}><button className="button is-light is-small is-pulled-right share">Share</button></Link> 
                    
                    {this.displayPhotosDropdown()}

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
                      {this.state.likes_num > 0 && <span className="likes-num">{this.state.likes_num} <label>likes</label></span>}
                    <time className="content-time">{this.state.time}</time>
                    </div>
                    
                    <div className="content-body"  ref={(desc) => this.desc = desc}>
                    {
                      this.state.edit ? (
                        <div>
                          <textarea class='textarea' rows='1' onChange={this.handleEditChange}>{this.state.description}</textarea>
                          <div class="field is-grouped edit-buttons">
                            <p class="control">
                              <button class='button is-primary is-small' onClick={this.handleSave}>Save</button>
                            </p>
                            <p class="control">
                              <button class='button is-primary is-small' onClick={() => this.setState({edit: false})}>Cancel</button>
                              </p>
                          </div>
                      </div>
                      ) : 
                      (this.state.description)
                    }


                    {this.state.tags.length != 0 && <Tags data={this.state.tags} />}

                    </div>
                      <hr/>
                      {this.context.state.logged && <Comments data={this.state.comments}/>}

                    <form onSubmit={this.handleSubmit} style={{display: this.context.state.logged ? 'block' : 'none' }}>
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
        } else {
          return null
        }
      }
    }
}

Post.contextType = ContextUser;

export default Post;