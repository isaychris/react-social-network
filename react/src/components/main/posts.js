import React from 'react';
import Post from '../post'

const Posts = (props) => {
    return (
        <div className="posts">
          <Post logged={props.logged} post_id="8Obu_xgzm"/>
          <Post logged={props.logged} post_id="ldrmuo432"/>
    </div>
    )
}

export default Posts;