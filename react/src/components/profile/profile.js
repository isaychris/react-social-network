import React, { Component } from 'react';
import Photos from './photos'
import {app} from "../../config/firebase_config"
import { Redirect } from 'react-router-dom'

class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: props.match.params.username,
            description: undefined,
            posts_num: 0,
            followers_num: 0,
            following_num: 0,
            follow: false,
            photos: [],
            redirect: false,
        }
    }

    handleFollow = () => {
        if(!this.props.logged) {
            alert("You must be logged in to do that.")
            return
          }

        if(!this.state.follow) {
            app.database().ref(`/profile/${this.props.logged}/following`).push({
                username: this.state.username
            }).then(() => {
                this.setState({
                    follow: true,
                    followers_num: this.state.followers_num + 1})
            })
        } else {
            app.database().ref(`/profile/${this.props.logged}/following`).orderByChild('username').equalTo(this.state.username).on("child_added", (snapshot) => {
                if(snapshot.val()) {
                    if(snapshot.val().username === this.state.username) {
                        snapshot.ref.remove()
                        this.setState({
                        follow: false,
                        followers_num: this.state.followers_num - 1})
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
                this.setState({posts: this.state.photos.length})
            }
        });
    }

    componentWillMount = () => {
        let accountsref = app.database().ref(`/profile/${this.state.username}`);
        accountsref.once("value", (snapshot) => {
            if(snapshot.val()) {
                this.setState({description: snapshot.val().description})
                this.addPhotos();
            } else {
                this.setState({redirect: true})
            }
        });

        app.database().ref(`/profile/${this.props.logged}/following`).orderByChild('username').equalTo(this.state.username).once("value", (snapshot) => {
            if(snapshot.val()) {
                this.setState({follow: true})
            }
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
                        <img className="is-rounded" src="https://picsum.photos/200/?random" alt=""/>
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
                        <li className="is-active"><a>Posts</a></li>
                        <li><a>Liked</a></li>
                        </ul>
                    </div>
                    <Photos data={this.state.photos}/>
                    </div>
                </div>
            </div>
            )
    }
}
}

export default Profile;