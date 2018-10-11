import React, { Component } from 'react';
import Photos from './photos'

class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: undefined,
            followers: undefined,
            following: undefined,
            follow: false
        }
    }

    render() {
        return(
            <div className="profile">
            <div className="card">
                <header className="card-header">
                    <figure className="image profile-avatar">
                        <img className="is-rounded" src="https://picsum.photos/200/?random" alt="Placeholder image"/>
                    </figure>
                    <div className="card-header-content">
                        <h1 className="title">Name</h1>
                        <div className="stats">
                            <ul>
                                <li><span className="post_num">0</span> posts</li>
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

                    <Photos/>

                    </div>
                </div>
            </div>
            )
    }
}

export default Profile;