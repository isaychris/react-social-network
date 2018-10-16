import React, { Component } from 'react';
import Updates from './updates'
import {app} from "../../config/firebase_config"

class Sidebar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            loading: true
        }
    }

    componentWillMount = () => { 
        this.props.following.forEach((user) => {
            app.database().ref(`/profile/${user}`).once("value", (snapshot) => {
                if(snapshot.val()) {
                    let value = {
                        username: snapshot.key,
                        last_update: snapshot.val().last_update}
                    this.setState({data: [...this.state.data, value]})
                }
            })
        })
        this.setState({loading: false})
    }

    render() {
        if(this.state.loading) {
            return null
        } else {
            return(
                <div className="sidebar">
                    <nav className="panel" styles="background-color: white;">
                        <p className="panel-heading has-text-centered">
                            Updates
                        </p>
                        <Updates data={this.state.data}/>
                    </nav>
                </div>
            )
        }
    }
}

export default Sidebar;