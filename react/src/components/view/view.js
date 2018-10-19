import React, { Component } from 'react';
import Post from '../post'
import { Redirect, Link } from 'react-router-dom'

class View extends Component {
    constructor(props) {
        super(props);

        this.state = {
            redirect_loc: undefined,
            redirect: false
        }
    }

    updateRedirect = (bool, location) => {
        this.setState({redirect: bool, redirect_loc: location})
    }

    render() {
        if (this.state.redirect && this.state.redirect_loc == "error") {
            return <Redirect to={`/error`}/>
        } else if (this.state.redirect && this.state.redirect_loc == "profile") {
            return <Redirect to={`/u/${this.props.logged}`}/>
        } else {
            return (
            <div className="view">
                <Post updateRedirect={this.updateRedirect} logged={this.props.logged} post_id={this.props.match.params.id}/>
            </div>
            )
        }
    }
}

export default View;