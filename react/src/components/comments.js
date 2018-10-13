import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom'

const Comments = (props) => {
    const commentslist = props.data.map((obj, index) => {
      let link = "/u/" + obj.username
      return (<li key={index}><span className="comment-username"><Link to={link}>{obj.username}</Link></span> <span className="comment">{obj.comment}</span></li>
      ) 
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