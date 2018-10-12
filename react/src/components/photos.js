import React, { Component } from 'react';

const Photos = () => {
    return(
        <div className="grid">
            <div className="user-content image is-square"><img src="https://picsum.photos/400/?random"/><div className="overlay"></div></div>
            <div className="user-content image is-square"><img src="https://picsum.photos/400/?random"/><div className="overlay"></div></div>
            <div className="user-content image is-square"><img src="https://picsum.photos/400/?random"/><div className="overlay"></div></div>
            <div className="user-content image is-square"><img src="https://picsum.photos/400/?random"/><div className="overlay"></div></div>
        </div>
    )
}

export default Photos;