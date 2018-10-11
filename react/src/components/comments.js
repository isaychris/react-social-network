import React, { Component } from 'react';

const Comments = () => {
    return (
        <div class="comments">
        <ul>
          <li><span class="comment-username">username</span> <span class="comment">Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit.</span></li>
          <li><span class="comment-username">username</span> <span class="comment">Lorem ipsum dolor sit amet consectetur adipisicing elit.</span></li>
          <li><span class="comment-username">username</span> <span class="comment">Lorem ipsum dolor sit amet </span></li>
          <li><span class="comment-username">username</span> <span class="comment">Lorem ipsum dolor </span></li>
        </ul>
      </div>
    );
}

export default Comments;