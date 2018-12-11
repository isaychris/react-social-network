import React, { Component } from 'react';
import { app } from "../../config/firebase_config"
import { Redirect } from 'react-router-dom'
import Photos from './photos'
import Likes from './likes'
import ContextUser from '../../contextUser'

//component for the profile page
class Profile extends Component {
    static contextType = ContextUser;

    constructor(props) {
        super(props);

        this.state = {
            mode: "posts",
            profile_pic: undefined,
            username: props.match.params.username,
            description: undefined,
            posts_num: 0,
            followers_num: 0,
            following_num: 0,
            follow: false,
            photos: [],
            liked: [],
            redirect: false,
        }
    }


    // Called immediately before mounting occurs, and before Component#render
    componentWillMount = () => {
        // check if the username exists in database
        app.database().ref(`/profile/${this.state.username}`).once("value", (snapshot) => {
            if(snapshot.val()) {
                let profile_pic = "https://firebasestorage.googleapis.com/v0/b/react-social-network-7e88b.appspot.com/o/assets%2Fdefault.png?alt=media"
                    
                if(snapshot.val().picture) {
                    profile_pic = snapshot.val().picture
                }

                // update profile state information
                this.setState({
                    description: snapshot.val().description, 
                    followers_num: snapshot.val().followers_num,
                    following_num: snapshot.val().following_num,
                    profile_pic: profile_pic
                })
                this.updatesPhotos();
                this.updateLikedPhotos();
            } else {
                // if not redirect to error page
                this.setState({redirect: true})
            }
        });

        // check if you are following this profile, if so.. toggle follow state
        app.database().ref(`/profile/${this.context.state.logged}/following`).orderByChild('username').equalTo(this.state.username).once("value", (snapshot) => {
            if(snapshot.val()) {
                this.setState({follow: true})
            }
        })
    }


    // retrieve users uploaded photos
    updatesPhotos = () => {
        app.database().ref(`/posts`).orderByChild('username').equalTo(this.state.username).once("value", (snapshot) => {
            if(snapshot.val()) {
                // update posts number
                this.setState({posts_num: snapshot.numChildren()})

                // for each photo object, insert the objects key inside itself as a key value pair,
                // then, append object to photos array state
                Object.entries(snapshot.val()).forEach(([key, val]) => {
                    val.id = key

                    this.setState({photos: [...this.state.photos, val]})
                });
            }
        });
    }



    // retrieve all photos that were liked from logged user
    updateLikedPhotos = () => {
        app.database().ref(`/profile/${this.state.username}/liked`).once("value", (snapshot) => {
            if(snapshot.val()) {

                // for each photo object, append to photos array state
                snapshot.forEach(snap => {
                    app.database().ref(`/posts/${snap.val().post}`).once("value", (snaps) => {
                        if(snaps.val()) {
                            let value = {id: snap.val().post, image: snaps.val().image}
                            this.setState({liked: [...this.state.liked, value]})
                        }
                    })
                })
            }
        });
    }



    // handles the click event on posts/liked tab, toggles which should be shown
    handleTab = () => {
        if(this.state.mode == "posts") {
            this.tab_posts.classList.remove("is-active")
            this.tab_likes.classList.add("is-active")
            this.setState({mode: "likes"})
        } 
        
        else if(this.state.mode == "likes") {
            this.tab_likes.classList.remove("is-active")
            this.tab_posts.classList.add("is-active")
            this.setState({mode: "posts"})
        }
    }



    // handles the click event on the follow button, toggles between follow / unfollow
    handleFollow = () => {
        // user must be logged in to follow/unfolow
        if(!this.context.state.logged) {
            alert("You must be logged in to do that.")
            return
          }

        // if logged in user is not following the profile
        if(!this.state.follow) {
            // follow the profile user; add them to logged users following list 
            app.database().ref(`/profile/${this.context.state.logged}/following`).push({
                username: this.state.username
            }).then(() => {
                // then increment following num
                app.database().ref(`/profile/${this.context.state.logged}/following_num`).transaction((value) => {
                    return value + 1;
                  });
                // and set follow to true
                this.setState({
                    follow: true,
                    followers_num: this.state.followers_num + 1})
            })

            // add logged user to profile users follwers list
            app.database().ref(`/profile/${this.state.username}/followers`).push({
                username: this.context.state.logged
            }).then(() => {
                // then increment followers num.
                app.database().ref(`/profile/${this.state.username}/followers_num`).transaction((value) => {
                    return value + 1;
                  });
            })
        }

        // if logged in user is following the profile
        else {
            // unfollow the profile user;
            app.database().ref(`/profile/${this.context.state.logged}/following`).orderByChild('username').equalTo(this.state.username).on("child_added", (snapshot) => {
                if(snapshot.val()) {
                    // remove them from logged users following list
                    if(snapshot.val().username === this.state.username) {
                        snapshot.ref.remove()
                        // then decrement following num
                        app.database().ref(`/profile/${this.context.state.logged}/following_num`).transaction((value) => {
                            return value - 1;
                          });
                        // and set following to false
                        this.setState({
                        follow: false,
                        followers_num: this.state.followers_num - 1})
                    }
                }
            })

            //remove logged user from profile users follwers list
            app.database().ref(`/profile/${this.state.username}/followers`).orderByChild('username').equalTo(this.context.state.logged).on("child_added", (snapshot) => {
                if(snapshot.val()) {
                    if(snapshot.val().username === this.context.state.logged) {
                        snapshot.ref.remove()
                        // then decrement followers num
                        app.database().ref(`/profile/${this.state.username}/followers_num`).transaction((value) => {
                            return value - 1;
                          });
                        }
                }
            })
        }
    }


    
    render() {
        if(this.state.redirect) {
            return <Redirect to="/error"/>
        } else {
        return(
            <div className="profile">
            <div className="card">
                <header className="card-header">
                    <figure className="image profile-avatar">
                        <img className="is-rounded" src={this.state.profile_pic} alt=""/>
                    </figure>
                    <div className="card-header-content profile-info">
                        <h1 className="title">{this.state.username}</h1>
                        <div className="stats">
                            <ul>
                                <li><span className="post_num">{this.state.posts_num}</span> posts</li>
                                <li><span className="follower_num">{this.state.followers_num}</span> followers</li>
                                <li><span className="following_num">{this.state.following_num}</span> following</li>
                            </ul>
                        </div>
                        <p>
                        {this.state.description}
                        </p>
                        <div className="profile-options">
                        {this.state.follow ? 
                            <button onClick={this.handleFollow} className="button is-primary is-small">Unfollow</button>
                            :
                            <button onClick={this.handleFollow} className="button is-primary is-outline is-small">Follow</button>
                        }
                        </div>
                    </div>

                </header>
                <div className="card-content">
                    <div className="tabs is-centered">
                        <ul>
                        <li ref={(tab) => this.tab_posts = tab} className="tab-posts is-active" onClick={this.handleTab}><a>Posts</a></li>
                        <li ref={(tab) => this.tab_likes = tab} className="tab-likes" onClick={this.handleTab}><a>Liked</a></li>
                        </ul>
                    </div>
                    {this.state.mode == "posts" ? <Photos data={this.state.photos}/> : <Likes data={this.state.liked}/> }
                    </div>
                </div>
            </div>
            )
    }
}
}

Profile.contextType = ContextUser;


export default Profile;