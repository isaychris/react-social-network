import React, { Component } from 'react';

const Comments = () => {
    return (
        <div className="comments">
        <ul>
          <li><span className="comment-username">username</span> <span className="comment">Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit.</span></li>
          <li><span className="comment-username">username</span> <span className="comment">Lorem ipsum dolor sit amet consectetur adipisicing elit.</span></li>
          <li><span className="comment-username">username</span> <span className="comment">Lorem ipsum dolor sit amet </span></li>
          <li><span className="comment-username">username</span> <span className="comment">Lorem ipsum dolor </span></li>
        </ul>
      </div>
    );
}

export default Comments;