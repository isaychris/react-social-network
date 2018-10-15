import React from 'react';

const Error = () => {
    return(
        <div className="error">
            <section className="hero is-large is-primary">
            <div className="hero-body">
                <div className="container has-text-centered">
                <h1 className="title">
                    404 Error
                </h1>
                <h2 className="subtitle">
                    Unable to find requested content
                </h2>
                <button className="button is-light">Home</button>
                </div>
            </div>
            </section>
        </div>
    )
}

export default Error;