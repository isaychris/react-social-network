import React, { Component } from 'react';
import Results from './results'
import {app} from "../../config/firebase_config"


//component for the profile page
class Search extends Component {

    constructor(props) {
        super(props);

        this.state = {
            redirect: false,
            data: [],
            query: this.props.match.params.q,
            loading: true
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.match.params.q !== this.props.match.params.q) {
            this.setState({data: [], query: this.props.match.params.q}, this.check())
        }
    }

    check = () => {
        app.database().ref(`/profile/${this.props.match.params.q}`).once("value", (snapshot) => {
            if(snapshot.val()) {    
                let profile_pic = "https://firebasestorage.googleapis.com/v0/b/react-social-network-7e88b.appspot.com/o/assets%2Fdefault.png?alt=media"
                    
                if(snapshot.val().picture) {
                    profile_pic = snapshot.val().picture
                }

                let value = {
                    profile_pic: profile_pic ,
                    username: snapshot.key,
                    description: snapshot.val().description
                }

                this.setState({data: [...this.state.data, value]})
            } 
        })

        // now component can be loaded
        this.setState({loading: false}) 
    }

    componentWillMount = () => {
        this.check()
    }

    render() {
        return (
            <div className="upload">
                <div className="card">
                    <div className="card-header">
                        <p className="card-header-title is-centered">
                        Search
                        </p>
                    </div>
                    <div className="card-content">

                    { this.state.loading ? 
                        (<span>Loading...</span>) : 
                        (<Results data={this.state.data}/>)
                    }
                    </div>
                    </div>
            </div>
        )
    }
}


export default Search