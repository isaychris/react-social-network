import React from 'react';
import { Link } from 'react-router-dom'

// functional component to display all commments of a photo
const Comments = (props) => {

    // create comments elements from data passed as props
    const commentslist = props.data.map((obj, index) => {
        let link = "/u/" + obj.username
        return (<li key={index}><span className="comment-username"><Link to={link}>{obj.username}</Link></span> <span className="comment">{obj.comment}</span></li>) 
    })



    return (
        <div className="comments">
            <ul>
                {commentslist}
            </ul>
      </div>
    );
}

export default Comments;