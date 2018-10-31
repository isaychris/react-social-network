import React, { Component } from 'react';
import { app } from "../../config/firebase_config"
import Sidebar from './sidebar'
import Posts from './posts'
import ContextUser from '../../contextUser'

// component for the main page
class Main extends Component {
    static contextType = ContextUser;

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            following_list: [],
            post_list: []
        }
    }


    // Called immediately after a component is mounted. Setting state here will trigger re-rendering.
    componentDidMount = () => {
        // retrieve list of followed users
        app.database().ref(`/profile/${this.context.state.logged}/following`).once("value", (snapshot) => {
            if(snapshot.val()) {
                snapshot.forEach((snap) => {
                    this.setState({following_list: [...this.state.following_list, snap.val().username]})
                })
                // then retrieve all of the followered users posts
                this.state.following_list.forEach((user) => {
                    app.database().ref(`/posts`).orderByChild('username').equalTo(user).once("value", (snapshot) => {
                        if(snapshot.val()) {
                            snapshot.forEach((snap) => {
                                this.setState({post_list: [...this.state.post_list, snap.key]})
                            })
                        } 
                    })
                })
                // once done fetching, now the component can be rendered
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
            return(
                <div className="main">
                    <div className="grid-container">
                        <Sidebar following={following_list}/>
                        <Posts data={post_list}/>
                    </div>            
                </div>
            )
        }
    }
}

Main.contextType = ContextUser;

export default Main;