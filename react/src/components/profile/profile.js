import React, { Component } from 'react';
import Photos from './photos'
import firebase from "../../config/firebase_config"
import { Redirect } from 'react-router-dom'

class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: props.match.params.username,
            posts_num: 0,
            followers_num: 0,
            following_num: 0,
            follow: false,
            photos: [],
            redirect: false
        }
    }

    addPhotos = () => {
        let postsref = firebase.database().ref(`/posts`);
        postsref.orderByChild('username').equalTo(this.state.username).once("value", (snapshot) => {
            if(snapshot.val()) {
                Object.entries(snapshot.val()).forEach(([key, val]) => {
                    val.id = key
                    this.setState({photos: [...this.state.photos, val]})
                });
                this.setState({posts: this.state.photos.length})
            }
        });
    }

    componentWillMount = () => {
        let accountsref = firebase.database().ref(`/accounts`);
        accountsref.orderByChild('username').equalTo(this.state.username).once("value", (snapshot) => {
            if(snapshot.val()) {
                this.addPhotos();
            } else {
                this.setState({redirect: true})
            }
        });
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
                        <img className="is-rounded" src="https://picsum.photos/200/?random" alt="Placeholder image"/>
                    </figure>
                    <div className="card-header-content profile-info">
                        <h1 className="title">{this.state.username}</h1>
                        <div className="stats">
                            <ul>
                                <li><span className="post_num">{this.state.posts}</span> posts</li>
                                <li><span className="follower_num">0</span> followers</li>
                                <li><span className="following_num">0</span> following</li>
                            </ul>
                        </div>
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        </p>
                        <div className="profile-options"> <button className="button is-primary is-outlined">Follow</button>
                        </div>
                    </div>

                </header>
                <div className="card-content">
                    <div className="tabs is-centered">
                        <ul>
                        <li className="is-active"><a>Posts</a></li>
                        <li><a>Tagged</a></li>
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