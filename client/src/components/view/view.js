import React, { Component } from 'react';
import Post from '../post/post'
import { Redirect, Link } from 'react-router-dom'
import ContextUser from '../../contextUser'

// container component for viewing a single picture
class View extends Component {
    static contextType = ContextUser;

    constructor(props) {
        super(props);

        this.state = {
            redirect_loc: undefined,
            redirect: false
        }
    }

    // handles the redirection, passed as a callback to Post component
    // Two redirections:
    // 1) to the photo
    // 2) to error page, if photo doesnt exist
    updateRedirect = (bool, location) => {
        this.setState({redirect: bool, redirect_loc: location})
    }



    render() {
        if (this.state.redirect && this.state.redirect_loc == "error") {
            return <Redirect to={`/error`}/>
        } else if (this.state.redirect && this.state.redirect_loc == "profile") {
            return <Redirect to={`/u/${this.context.state.logged}`}/>
        } else {
            return (
            <div className="view">
                <Post updateRedirect={this.updateRedirect} post_id={this.props.match.params.id}/>
            </div>
            )
        }
    }
}

View.contextType = ContextUser;


export default View;