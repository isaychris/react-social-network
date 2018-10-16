import React, { Component } from 'react';
import Sidebar from './sidebar'
import Posts from './posts'
import {app} from "../../config/firebase_config"

class Main extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            following_list: [],
            post_list: []
        }
    }

    componentDidMount = () => {
        app.database().ref(`/profile/${this.props.logged}/following`).once("value", (snapshot) => {
            if(snapshot.val()) {
                snapshot.forEach((snap) => {
                    this.setState({following_list: [...this.state.following_list, snap.val().username]})
                })

                this.state.following_list.forEach((user) => {
                    app.database().ref(`/posts`).orderByChild('username').equalTo(user).once("value", (snapshot) => {
                        if(snapshot.val()) {
                            snapshot.forEach((snap) => {
                                this.setState({post_list: [...this.state.post_list, snap.key]})
                            })
                        } 
                    })
                })
                this.setState({loading: false})
            } else {
                this.setState({loading: false})
            }
        })
    }

    render() {
        const {following_list, post_list, loading} = this.state
        if(loading) {
            return <div>loading...</div>;
        } else {
            console.log("Empty")
            return(
                <div className="main">
                    <div className="grid-container">
                        <Sidebar following={following_list} logged={this.props.logged}/>
                        <Posts data={post_list} logged={this.props.logged}/>
                    </div>            
                </div>
            )
        }
    }
}

export default Main;