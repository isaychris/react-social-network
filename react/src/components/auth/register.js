import React, { Component } from 'react';

class Register extends Component {
    render() {
        return(
            <div className="register">
                <div className="card">
                    <div className="card-header">
                        <p className="card-header-title is-centered">
                        Register
                        </p>
                    </div>

                    <div className="card-content">
                        <input className="input is-centered" type="text" placeholder="Username"></input>
                        <br/><br/>
                        <input className="input is-centered" type="password" placeholder="Password"></input>
                        <br/><br/>
                        <button className="button is-primary is-fullwidth">Enter</button>
                    </div>
                </div>
            </div>
         )
    }
}

export default Register;