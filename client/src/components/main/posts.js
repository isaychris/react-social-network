import React from 'react';
import Post from '../post'

// functional component for the main page
const Posts = (props) => {
    // create Post elements from data passed as props
    const postlist = props.data.map((obj, index) => {
        return (<Post key={index} logged={props.logged} post_id={obj}/>) 
    })


    
    return (
        <div className="posts">
            {props.data == 0 && <p>There are no posts.</p>}
            {postlist}

        </div>
    )
}

export default Posts;