import React, { Component } from 'react';
import Photos from './photos'
import Likes from './likes'

import {app} from "../../config/firebase_config"
import { Redirect } from 'react-router-dom'

class Profile extends Component {
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

    handleTab = (e) => {
        if(this.state.mode == "posts") {
            this.tab_posts.classList.remove("is-active")
            this.tab_likes.classList.add("is-active")
            this.setState({mode: "likes"})
        } else if(this.state.mode == "likes") {
            this.tab_likes.classList.remove("is-active")
            this.tab_posts.classList.add("is-active")
            this.setState({mode: "posts"})
        }
    }
    handleFollow = () => {
        if(!this.props.logged) {
            alert("You must be logged in to do that.")
            return
          }

        if(!this.state.follow) {
            // follow the profile user; add them to logged users following list and increment num
            app.database().ref(`/profile/${this.props.logged}/following`).push({
                username: this.state.username
            }).then(() => {
                app.database().ref(`/profile/${this.props.logged}/following_num`).transaction((value) => {
                    return value + 1;
                  });
                this.setState({
                    follow: true,
                    followers_num: this.state.followers_num + 1})
            })

            // add logged user to profile users follwers list and increment num.
            app.database().ref(`/profile/${this.state.username}/followers`).push({
                username: this.props.logged
            }).then(() => {
                app.database().ref(`/profile/${this.state.username}/followers_num`).transaction((value) => {
                    return value + 1;
                  });
            })
        } else {

            // unfollow the profile user; remove them from logged users following list and decrement num
            app.database().ref(`/profile/${this.props.logged}/following`).orderByChild('username').equalTo(this.state.username).on("child_added", (snapshot) => {
                if(snapshot.val()) {
                    if(snapshot.val().username === this.state.username) {
                        snapshot.ref.remove()
                        app.database().ref(`/profile/${this.props.logged}/following_num`).transaction((value) => {
                            return value - 1;
                          });
                        this.setState({
                        follow: false,
                        followers_num: this.state.followers_num - 1})
                    }
                }
            })

            //remove logged user from profile users follwers list and decrement num
            app.database().ref(`/profile/${this.state.username}/followers`).orderByChild('username').equalTo(this.props.logged).on("child_added", (snapshot) => {
                if(snapshot.val()) {
                    if(snapshot.val().username === this.props.logged) {
                        snapshot.ref.remove()
                        app.database().ref(`/profile/${this.state.username}/followers_num`).transaction((value) => {
                            return value - 1;
                          });
                        }
                }
            })
        }
    }

    addPhotos = () => {
        let postsref = app.database().ref(`/posts`);
        postsref.orderByChild('username').equalTo(this.state.username).once("value", (snapshot) => {
            if(snapshot.val()) {
                this.setState({posts_num: snapshot.numChildren()})
                Object.entries(snapshot.val()).forEach(([key, val]) => {
                    val.id = key
                    this.setState({photos: [...this.state.photos, val]})
                });
                this.setState({posts_num: this.state.photos.length})
            }
        });
    }

    addLikes = () => {
        app.database().ref(`/profile/${this.state.username}/liked`).once("value", (snapshot) => {
            if(snapshot.val()) {
                console.log("ITS WORKING")
                snapshot.forEach(snap => {
                    app.database().ref(`/posts/${snap.val().post}`).once("value", (snaps) => {
                        let value = {id: snap.val().post, image: snaps.val().image}
                        this.setState({liked: [...this.state.liked, value]})
                    })
                })
            }
        });
    }

    componentWillMount = () => {
        let accountsref = app.database().ref(`/profile/${this.state.username}`);
        accountsref.once("value", (snapshot) => {
            if(snapshot.val()) {
                this.setState({
                    description: snapshot.val().description, 
                    followers_num: snapshot.val().followers_num,
                    following_num: snapshot.val().following_num
                })
                this.addPhotos();
                this.addLikes();
            } else {
                this.setState({redirect: true})
            }
        });

        app.database().ref(`/profile/${this.props.logged}/following`).orderByChild('username').equalTo(this.state.username).once("value", (snapshot) => {
            if(snapshot.val()) {
                this.setState({follow: true})
            }
        })

        app.storage().ref(`profile/${this.state.username}`).child("profile").getDownloadURL().then((url) => {
            this.setState({profile_pic: url})
        }).catch((error) => {
            this.setState({profile_pic: "https://firebasestorage.googleapis.com/v0/b/react-social-network-7e88b.appspot.com/o/assets%2Fdefault.png?alt=media"})
        })
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

export default Profile;